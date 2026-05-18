import Purchase from '../models/Purchase.js';
import InventoryService from '../services/InventoryService.js';
import { createPurchaseValidator } from '../validators/schemas.js';

export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.json({ data: purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
};

export const getPurchasesByBase = async (req, res) => {
  try {
    const { baseId } = req.params;
    const purchases = await Purchase.findByBase(baseId);
    res.json({ data: purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ message: 'Failed to fetch purchases' });
  }
};

export const createPurchase = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const validation = createPurchaseValidator.safeParse(req.body);
    if (!validation.success) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { base_id, equipment_type_id, quantity, purchase_date, remarks } = validation.data;
    const userId = req.user.userId;

    const purchase = await Purchase.create(
      base_id,
      equipment_type_id,
      quantity,
      purchase_date,
      remarks || null,
      userId,
      client
    );

    await InventoryService.updateInventoryOnPurchase(base_id, equipment_type_id, quantity, client);

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Purchase created successfully',
      data: purchase 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create purchase error:', error);
    res.status(500).json({ message: 'Failed to create purchase' });
  } finally {
    client.release();
  }
};

export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findById(id);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    res.json({ data: purchase });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ message: 'Failed to fetch purchase' });
  }
};

export default { getAllPurchases, getPurchasesByBase, createPurchase, getPurchaseById };

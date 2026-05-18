import Expenditure from '../models/Expenditure.js';
import InventoryService from '../services/InventoryService.js';
import pool from '../config/database.js';
import { createExpenditureValidator } from '../validators/schemas.js';

export const getAllExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.findAll();
    res.json({ data: expenditures });
  } catch (error) {
    console.error('Get expenditures error:', error);
    res.status(500).json({ message: 'Failed to fetch expenditures' });
  }
};

export const getExpendituresByBase = async (req, res) => {
  try {
    const { baseId } = req.params;
    const expenditures = await Expenditure.findByBase(baseId);
    res.json({ data: expenditures });
  } catch (error) {
    console.error('Get expenditures error:', error);
    res.status(500).json({ message: 'Failed to fetch expenditures' });
  }
};

export const createExpenditure = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const validation = createExpenditureValidator.safeParse(req.body);
    if (!validation.success) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { base_id, equipment_type_id, quantity, reason, expenditure_date } = validation.data;
    const userId = req.user.userId;

    if (req.user.role === 'Base Commander') {
      if (parseInt(req.user.assigned_base_id, 10) !== base_id) {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: 'Base Commander may only record expenditures for assigned base' });
      }
    }

    await InventoryService.updateInventoryOnExpenditure(base_id, equipment_type_id, quantity, client);

    const expenditure = await Expenditure.create(
      base_id,
      equipment_type_id,
      quantity,
      reason,
      expenditure_date,
      userId,
      client
    );

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Expenditure created successfully',
      data: expenditure 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create expenditure error:', error);
    res.status(500).json({ message: error.message || 'Failed to create expenditure' });
  } finally {
    client.release();
  }
};

export default { getAllExpenditures, getExpendituresByBase, createExpenditure };

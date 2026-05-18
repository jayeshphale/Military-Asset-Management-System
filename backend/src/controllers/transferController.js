import Transfer from '../models/Transfer.js';
import Inventory from '../models/Inventory.js';
import InventoryService from '../services/InventoryService.js';
import pool from '../config/database.js';
import { createTransferValidator } from '../validators/schemas.js';

export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll();
    res.json({ data: transfers });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: 'Failed to fetch transfers' });
  }
};

export const getTransfersByBase = async (req, res) => {
  try {
    const { baseId } = req.params;
    const transfers = await Transfer.findByBase(baseId);
    res.json({ data: transfers });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({ message: 'Failed to fetch transfers' });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const validation = createTransferValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, remarks } = validation.data;
    const userId = req.user.userId;

    // Validate
    if (from_base_id === to_base_id) {
      return res.status(400).json({ message: 'Source and destination bases cannot be the same' });
    }

    const inventory = await Inventory.findByBaseAndEquipment(from_base_id, equipment_type_id);
    if (!inventory || inventory.current_balance < quantity) {
      return res.status(400).json({ message: 'Insufficient inventory at source base' });
    }

    const transfer = await Transfer.create(
      from_base_id,
      to_base_id,
      equipment_type_id,
      quantity,
      transfer_date,
      'Pending',
      remarks || null,
      userId
    );

    res.status(201).json({ 
      message: 'Transfer created successfully',
      data: transfer 
    });
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({ message: 'Failed to create transfer' });
  }
};

export const updateTransferStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Invalid status' });
    }

    const transfer = await Transfer.findById(id);
    if (!transfer) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (status === 'Completed') {
      await InventoryService.updateInventoryOnTransfer(
        transfer.from_base_id,
        transfer.to_base_id,
        transfer.equipment_type_id,
        transfer.quantity,
        status,
        client
      );
    }

    const updatedTransfer = await Transfer.updateStatus(id, status, client);

    await client.query('COMMIT');

    res.json({ 
      message: 'Transfer status updated successfully',
      data: updatedTransfer 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update transfer error:', error);
    res.status(500).json({ message: error.message || 'Failed to update transfer' });
  } finally {
    client.release();
  }
};

export const getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await Transfer.findById(id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    res.json({ data: transfer });
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({ message: 'Failed to fetch transfer' });
  }
};

export default { getAllTransfers, getTransfersByBase, createTransfer, updateTransferStatus, getTransferById };

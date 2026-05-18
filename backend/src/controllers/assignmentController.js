import Assignment from '../models/Assignment.js';
import Inventory from '../models/Inventory.js';
import InventoryService from '../services/InventoryService.js';
import pool from '../config/database.js';
import { createAssignmentValidator } from '../validators/schemas.js';

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    res.json({ data: assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

export const getAssignmentsByBase = async (req, res) => {
  try {
    const { baseId } = req.params;
    const assignments = await Assignment.findByBase(baseId);
    res.json({ data: assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

export const createAssignment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const validation = createAssignmentValidator.safeParse(req.body);
    if (!validation.success) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Validation error', errors: validation.error.errors });
    }

    const { base_id, equipment_type_id, assigned_to, quantity, assignment_date } = validation.data;
    const userId = req.user.userId;

    if (req.user.role === 'Base Commander') {
      if (parseInt(req.user.assigned_base_id, 10) !== base_id) {
        await client.query('ROLLBACK');
        return res.status(403).json({ message: 'Base Commander may only assign equipment from their assigned base' });
      }
    }

    await InventoryService.updateInventoryOnAssignment(base_id, equipment_type_id, quantity, client);

    const assignment = await Assignment.create(
      base_id,
      equipment_type_id,
      assigned_to,
      quantity,
      assignment_date,
      userId,
      client
    );

    await client.query('COMMIT');

    res.status(201).json({ 
      message: 'Assignment created successfully',
      data: assignment 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create assignment error:', error);
    res.status(500).json({ message: error.message || 'Failed to create assignment' });
  } finally {
    client.release();
  }
};

export default { getAllAssignments, getAssignmentsByBase, createAssignment };

import Inventory from '../models/Inventory.js';
import pool from '../config/database.js';

export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll();
    res.json({ data: inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

export const getInventoryByBase = async (req, res) => {
  try {
    const { baseId } = req.params;
    const userRole = req.user.role;
    const userId = req.user.userId;

    if (userRole === 'Base Commander') {
      const result = await pool.query('SELECT assigned_base_id FROM users WHERE id = $1', [userId]);
      const assignedBaseId = result.rows[0]?.assigned_base_id;

      if (!assignedBaseId || parseInt(baseId, 10) !== assignedBaseId) {
        return res.status(403).json({ message: 'Access denied to requested base inventory' });
      }
    }

    const inventory = await Inventory.findByBase(baseId);
    res.json({ data: inventory });
  } catch (error) {
    console.error('Get inventory by base error:', error);
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

export default { getAllInventory, getInventoryByBase };
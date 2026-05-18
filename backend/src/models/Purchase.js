import pool from '../config/database.js';

const queryClient = (client) => client || pool;

export const Purchase = {
  findAll: async (client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT p.*, b.name as base_name, et.name as equipment_name, u.name as created_by_name
       FROM purchases p
       JOIN bases b ON p.base_id = b.id
       JOIN equipment_types et ON p.equipment_type_id = et.id
       JOIN users u ON p.created_by = u.id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  },

  findByBase: async (baseId, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT p.*, b.name as base_name, et.name as equipment_name, u.name as created_by_name
       FROM purchases p
       JOIN bases b ON p.base_id = b.id
       JOIN equipment_types et ON p.equipment_type_id = et.id
       JOIN users u ON p.created_by = u.id
       WHERE p.base_id = $1
       ORDER BY p.created_at DESC`,
      [baseId]
    );
    return result.rows;
  },

  create: async (baseId, equipmentId, quantity, purchaseDate, remarks, createdBy, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `INSERT INTO purchases (base_id, equipment_type_id, quantity, purchase_date, remarks, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [baseId, equipmentId, quantity, purchaseDate, remarks, createdBy]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT p.*, b.name as base_name, et.name as equipment_name
       FROM purchases p
       JOIN bases b ON p.base_id = b.id
       JOIN equipment_types et ON p.equipment_type_id = et.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }
};

export default Purchase;

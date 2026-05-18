import pool from '../config/database.js';

const queryClient = (client) => client || pool;

export const Transfer = {
  findAll: async (client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT t.*, fb.name as from_base_name, tb.name as to_base_name, et.name as equipment_name, u.name as created_by_name
       FROM transfers t
       JOIN bases fb ON t.from_base_id = fb.id
       JOIN bases tb ON t.to_base_id = tb.id
       JOIN equipment_types et ON t.equipment_type_id = et.id
       JOIN users u ON t.created_by = u.id
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  },

  findByBase: async (baseId) => {
    const result = await pool.query(
      `SELECT t.*, fb.name as from_base_name, tb.name as to_base_name, et.name as equipment_name
       FROM transfers t
       JOIN bases fb ON t.from_base_id = fb.id
       JOIN bases tb ON t.to_base_id = tb.id
       JOIN equipment_types et ON t.equipment_type_id = et.id
       WHERE t.from_base_id = $1 OR t.to_base_id = $1
       ORDER BY t.created_at DESC`,
      [baseId]
    );
    return result.rows;
  },

  create: async (fromBaseId, toBaseId, equipmentId, quantity, transferDate, status, remarks, createdBy) => {
    const result = await pool.query(
      `INSERT INTO transfers (from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, status, remarks, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [fromBaseId, toBaseId, equipmentId, quantity, transferDate, status, remarks, createdBy]
    );
    return result.rows[0];
  },

  updateStatus: async (id, status, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      'UPDATE transfers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT t.*, fb.name as from_base_name, tb.name as to_base_name, et.name as equipment_name
       FROM transfers t
       JOIN bases fb ON t.from_base_id = fb.id
       JOIN bases tb ON t.to_base_id = tb.id
       JOIN equipment_types et ON t.equipment_type_id = et.id
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  }
};

export default Transfer;

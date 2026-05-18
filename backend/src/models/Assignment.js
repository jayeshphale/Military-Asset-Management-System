import pool from '../config/database.js';

const queryClient = (client) => client || pool;

export const Assignment = {
  findAll: async (client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT a.*, b.name as base_name, et.name as equipment_name, u.name as created_by_name
       FROM assignments a
       JOIN bases b ON a.base_id = b.id
       JOIN equipment_types et ON a.equipment_type_id = et.id
       JOIN users u ON a.created_by = u.id
       ORDER BY a.created_at DESC`
    );
    return result.rows;
  },

  findByBase: async (baseId, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT a.*, b.name as base_name, et.name as equipment_name
       FROM assignments a
       JOIN bases b ON a.base_id = b.id
       JOIN equipment_types et ON a.equipment_type_id = et.id
       WHERE a.base_id = $1
       ORDER BY a.created_at DESC`,
      [baseId]
    );
    return result.rows;
  },

  create: async (baseId, equipmentId, assignedTo, quantity, assignmentDate, createdBy, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `INSERT INTO assignments (base_id, equipment_type_id, assigned_to, quantity, assignment_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [baseId, equipmentId, assignedTo, quantity, assignmentDate, createdBy]
    );
    return result.rows[0];
  },

  getTotalAssigned: async (baseId, equipmentId) => {
    const result = await pool.query(
      'SELECT COALESCE(SUM(quantity), 0) as total FROM assignments WHERE base_id = $1 AND equipment_type_id = $2',
      [baseId, equipmentId]
    );
    return result.rows[0].total;
  }
};

export default Assignment;

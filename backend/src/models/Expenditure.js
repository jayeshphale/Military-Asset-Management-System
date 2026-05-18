import pool from '../config/database.js';

const queryClient = (client) => client || pool;

export const Expenditure = {
  findAll: async (client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT e.*, b.name as base_name, et.name as equipment_name, u.name as created_by_name
       FROM expenditures e
       JOIN bases b ON e.base_id = b.id
       JOIN equipment_types et ON e.equipment_type_id = et.id
       JOIN users u ON e.created_by = u.id
       ORDER BY e.created_at DESC`
    );
    return result.rows;
  },

  findByBase: async (baseId, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT e.*, b.name as base_name, et.name as equipment_name
       FROM expenditures e
       JOIN bases b ON e.base_id = b.id
       JOIN equipment_types et ON e.equipment_type_id = et.id
       WHERE e.base_id = $1
       ORDER BY e.created_at DESC`,
      [baseId]
    );
    return result.rows;
  },

  create: async (baseId, equipmentId, quantity, reason, expenditureDate, createdBy, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `INSERT INTO expenditures (base_id, equipment_type_id, quantity, reason, expenditure_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [baseId, equipmentId, quantity, reason, expenditureDate, createdBy]
    );
    return result.rows[0];
  },

  getTotalExpended: async (baseId, equipmentId) => {
    const result = await pool.query(
      'SELECT COALESCE(SUM(quantity), 0) as total FROM expenditures WHERE base_id = $1 AND equipment_type_id = $2',
      [baseId, equipmentId]
    );
    return result.rows[0].total;
  }
};

export default Expenditure;

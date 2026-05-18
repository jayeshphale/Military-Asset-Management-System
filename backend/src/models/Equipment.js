import pool from '../config/database.js';

export const Equipment = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM equipment_types ORDER BY name');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM equipment_types WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (name, category, unit) => {
    const result = await pool.query(
      'INSERT INTO equipment_types (name, category, unit) VALUES ($1, $2, $3) RETURNING *',
      [name, category, unit]
    );
    return result.rows[0];
  },

  update: async (id, name, category, unit) => {
    const result = await pool.query(
      'UPDATE equipment_types SET name = $1, category = $2, unit = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, category, unit, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM equipment_types WHERE id = $1', [id]);
  }
};

export default Equipment;

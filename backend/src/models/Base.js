import pool from '../config/database.js';

export const Base = {
  findAll: async () => {
    const result = await pool.query('SELECT * FROM bases ORDER BY name');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM bases WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (name, location) => {
    const result = await pool.query(
      'INSERT INTO bases (name, location) VALUES ($1, $2) RETURNING *',
      [name, location]
    );
    return result.rows[0];
  },

  update: async (id, name, location) => {
    const result = await pool.query(
      'UPDATE bases SET name = $1, location = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM bases WHERE id = $1', [id]);
  }
};

export default Base;

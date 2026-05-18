import pool from '../config/database.js';

export const User = {
  findAll: async () => {
    const result = await pool.query('SELECT id, name, email, role, assigned_base_id, created_at FROM users');
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query('SELECT id, name, email, role, assigned_base_id, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  create: async (name, email, password, role, assigned_base_id = null) => {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, assigned_base_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, assigned_base_id',
      [name, email, password, role, assigned_base_id]
    );
    return result.rows[0];
  },

  update: async (id, name, role, assigned_base_id) => {
    const result = await pool.query(
      'UPDATE users SET name = $1, role = $2, assigned_base_id = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, role, assigned_base_id',
      [name, role, assigned_base_id, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
};

export default User;

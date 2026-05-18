import pool from '../config/database.js';

export const AuditLog = {
  findAll: async (limit = 50, offset = 0) => {
    const result = await pool.query(
      `SELECT al.*, u.name as user_name, u.email as user_email
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.timestamp DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  },

  count: async () => {
    const result = await pool.query('SELECT COUNT(*) as count FROM audit_logs');
    return result.rows[0].count;
  },

  findByUser: async (userId, limit = 50, offset = 0) => {
    const result = await pool.query(
      `SELECT * FROM audit_logs
       WHERE user_id = $1
       ORDER BY timestamp DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  findByDateRange: async (startDate, endDate) => {
    const result = await pool.query(
      `SELECT * FROM audit_logs
       WHERE timestamp >= $1 AND timestamp <= $2
       ORDER BY timestamp DESC`,
      [startDate, endDate]
    );
    return result.rows;
  }
};

export default AuditLog;

import pool from '../config/database.js';

export const auditLog = async (userId, action, moduleName, method, endpoint, payload, ipAddress) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs 
       (user_id, action, module_name, request_method, endpoint, payload, ip_address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, action, moduleName, method, endpoint, JSON.stringify(payload), ipAddress]
    );
  } catch (error) {
    console.error('Audit logging error:', error);
  }
};

export const auditMiddleware = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    const userId = req.user?.userId;
    const action = req.method;
    const pathParts = req.originalUrl.split('/').filter(Boolean);
    const moduleName = pathParts[1] || 'unknown';
    const endpoint = req.originalUrl;
    const ipAddress = req.ip;

    auditLog(userId, action, moduleName, req.method, endpoint, req.body, ipAddress).catch(
      (err) => console.error('Audit log error:', err)
    );

    originalJson.call(this, data);
  };

  next();
};

export default { auditLog, auditMiddleware };

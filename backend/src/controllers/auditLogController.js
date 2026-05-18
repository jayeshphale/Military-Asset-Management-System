import AuditLog from '../models/AuditLog.js';

export const getAllAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const logs = await AuditLog.findAll(limit, offset);
    const count = await AuditLog.count();

    res.json({ 
      data: logs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};

export const getAuditLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const logs = await AuditLog.findByUser(userId, limit, offset);
    res.json({ data: logs });
  } catch (error) {
    console.error('Get user audit logs error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};

export const getAuditLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const logs = await AuditLog.findByDateRange(new Date(startDate), new Date(endDate));
    res.json({ data: logs });
  } catch (error) {
    console.error('Get audit logs by date range error:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};

export default { getAllAuditLogs, getAuditLogsByUser, getAuditLogsByDateRange };

import express from 'express';
import * as auditLogController from '../controllers/auditLogController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Admin'), auditLogController.getAllAuditLogs);
router.get('/user/:userId', authorizeRoles('Admin'), auditLogController.getAuditLogsByUser);
router.get('/range', authorizeRoles('Admin'), auditLogController.getAuditLogsByDateRange);

export default router;

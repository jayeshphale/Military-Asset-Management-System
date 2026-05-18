import express from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Base Commander', 'Admin'), assignmentController.getAllAssignments);
router.get('/base/:baseId', authorizeRoles('Base Commander', 'Admin'), assignmentController.getAssignmentsByBase);
router.post('/', authorizeRoles('Base Commander', 'Admin'), assignmentController.createAssignment);

export default router;

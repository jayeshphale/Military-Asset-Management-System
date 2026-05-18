import express from 'express';
import * as transferController from '../controllers/transferController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Logistics Officer', 'Admin'), transferController.getAllTransfers);
router.get('/base/:baseId', authorizeRoles('Logistics Officer', 'Admin'), transferController.getTransfersByBase);
router.get('/:id', authorizeRoles('Logistics Officer', 'Admin'), transferController.getTransferById);
router.post('/', authorizeRoles('Logistics Officer', 'Admin'), transferController.createTransfer);
router.put('/:id/status', authorizeRoles('Logistics Officer', 'Admin'), transferController.updateTransferStatus);

export default router;

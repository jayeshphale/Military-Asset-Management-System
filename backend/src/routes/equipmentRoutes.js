import express from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', equipmentController.getAllEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', authorizeRoles('Admin'), equipmentController.createEquipment);
router.put('/:id', authorizeRoles('Admin'), equipmentController.updateEquipment);
router.delete('/:id', authorizeRoles('Admin'), equipmentController.deleteEquipment);

export default router;

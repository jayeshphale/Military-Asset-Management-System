import express from 'express';
import * as baseController from '../controllers/baseController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', baseController.getAllBases);
router.get('/:id', baseController.getBaseById);
router.post('/', authorizeRoles('Admin'), baseController.createBase);
router.put('/:id', authorizeRoles('Admin'), baseController.updateBase);
router.delete('/:id', authorizeRoles('Admin'), baseController.deleteBase);

export default router;

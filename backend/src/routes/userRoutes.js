import express from 'express';
import * as userController from '../controllers/userController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Admin'), userController.getAllUsers);
router.get('/:id', authorizeRoles('Admin'), userController.getUserById);
router.post('/', authorizeRoles('Admin'), userController.createUser);
router.put('/:id', authorizeRoles('Admin'), userController.updateUser);
router.delete('/:id', authorizeRoles('Admin'), userController.deleteUser);

export default router;

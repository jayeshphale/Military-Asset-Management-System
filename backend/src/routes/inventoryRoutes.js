import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Admin', 'Logistics Officer'), inventoryController.getAllInventory);
router.get('/base/:baseId', inventoryController.getInventoryByBase);

export default router;

import express from 'express';
import * as purchaseController from '../controllers/purchaseController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Logistics Officer', 'Admin'), purchaseController.getAllPurchases);
router.get('/base/:baseId', authorizeRoles('Logistics Officer', 'Admin'), purchaseController.getPurchasesByBase);
router.get('/:id', authorizeRoles('Logistics Officer', 'Admin'), purchaseController.getPurchaseById);
router.post('/', authorizeRoles('Logistics Officer', 'Admin'), purchaseController.createPurchase);

export default router;

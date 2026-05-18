import express from 'express';
import * as expenditureController from '../controllers/expenditureController.js';
import { authorizeRoles } from '../middleware/rbac.js';

const router = express.Router();

router.get('/', authorizeRoles('Base Commander', 'Admin'), expenditureController.getAllExpenditures);
router.get('/base/:baseId', authorizeRoles('Base Commander', 'Admin'), expenditureController.getExpendituresByBase);
router.post('/', authorizeRoles('Base Commander', 'Admin'), expenditureController.createExpenditure);

export default router;

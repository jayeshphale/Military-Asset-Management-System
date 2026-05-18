import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/summary', dashboardController.getDashboardSummary);
router.get('/net-movement', dashboardController.getNetMovementDetails);

export default router;

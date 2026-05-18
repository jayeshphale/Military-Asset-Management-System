import Inventory from '../models/Inventory.js';
import InventoryService from '../services/InventoryService.js';
import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import pool from '../config/database.js';

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let baseId = null;
    if (userRole === 'Base Commander') {
      const userResult = await pool.query('SELECT assigned_base_id FROM users WHERE id = $1', [userId]);
      baseId = userResult.rows[0]?.assigned_base_id || null;
    }

    const inventoryQuery = baseId
      ? `SELECT SUM(opening_balance) as total_opening, SUM(current_balance) as total_inventory FROM inventory WHERE base_id = $1`
      : `SELECT SUM(opening_balance) as total_opening, SUM(current_balance) as total_inventory FROM inventory`;
    const inventoryParams = baseId ? [baseId] : [];
    const inventoryResult = await pool.query(inventoryQuery, inventoryParams);
    const totalOpening = parseInt(inventoryResult.rows[0]?.total_opening || 0, 10);
    const totalInventory = parseInt(inventoryResult.rows[0]?.total_inventory || 0, 10);

    const assignmentQuery = baseId
      ? `SELECT COALESCE(SUM(quantity), 0) as total FROM assignments WHERE base_id = $1`
      : `SELECT COALESCE(SUM(quantity), 0) as total FROM assignments`;
    const assignmentResult = await pool.query(assignmentQuery, inventoryParams);
    const totalAssigned = parseInt(assignmentResult.rows[0]?.total || 0, 10);

    const expenditureQuery = baseId
      ? `SELECT COALESCE(SUM(quantity), 0) as total FROM expenditures WHERE base_id = $1`
      : `SELECT COALESCE(SUM(quantity), 0) as total FROM expenditures`;
    const expenditureResult = await pool.query(expenditureQuery, inventoryParams);
    const totalExpended = parseInt(expenditureResult.rows[0]?.total || 0, 10);

    const purchaseQuery = baseId
      ? `SELECT COALESCE(SUM(quantity), 0) as total FROM purchases WHERE base_id = $1`
      : `SELECT COALESCE(SUM(quantity), 0) as total FROM purchases`;
    const purchaseResult = await pool.query(purchaseQuery, inventoryParams);
    const totalPurchased = parseInt(purchaseResult.rows[0]?.total || 0, 10);

    const transfersInQuery = baseId
      ? `SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE to_base_id = $1 AND status = 'Completed'`
      : `SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE status = 'Completed'`;
    const transfersInResult = await pool.query(transfersInQuery, inventoryParams);
    const totalTransfersIn = parseInt(transfersInResult.rows[0]?.total || 0, 10);

    const transfersOutQuery = baseId
      ? `SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE from_base_id = $1 AND status = 'Completed'`
      : `SELECT COALESCE(SUM(quantity), 0) as total FROM transfers WHERE status = 'Completed'`;
    const transfersOutResult = await pool.query(transfersOutQuery, inventoryParams);
    const totalTransfersOut = parseInt(transfersOutResult.rows[0]?.total || 0, 10);

    const netMovement = totalPurchased + totalTransfersIn - totalTransfersOut;
    const closingBalance = totalOpening + netMovement - totalAssigned - totalExpended;

    const recentTransactionsQuery = baseId
      ? `SELECT 'purchase' as type, p.base_id, p.equipment_type_id, p.quantity, p.created_at
         FROM purchases p WHERE p.base_id = $1
         UNION ALL
         SELECT 'transfer' as type, t.to_base_id as base_id, t.equipment_type_id, t.quantity, t.created_at
         FROM transfers t WHERE (t.from_base_id = $1 OR t.to_base_id = $1)
         UNION ALL
         SELECT 'assignment' as type, a.base_id, a.equipment_type_id, a.quantity, a.created_at
         FROM assignments a WHERE a.base_id = $1
         UNION ALL
         SELECT 'expenditure' as type, e.base_id, e.equipment_type_id, e.quantity, e.created_at
         FROM expenditures e WHERE e.base_id = $1
         ORDER BY created_at DESC LIMIT 10`
      : `SELECT 'purchase' as type, p.base_id, p.equipment_type_id, p.quantity, p.created_at
         FROM purchases p
         UNION ALL
         SELECT 'transfer' as type, t.to_base_id as base_id, t.equipment_type_id, t.quantity, t.created_at
         FROM transfers t
         UNION ALL
         SELECT 'assignment' as type, a.base_id, a.equipment_type_id, a.quantity, a.created_at
         FROM assignments a
         UNION ALL
         SELECT 'expenditure' as type, e.base_id, e.equipment_type_id, e.quantity, e.created_at
         FROM expenditures e
         ORDER BY created_at DESC LIMIT 10`;
    const recentResult = await pool.query(recentTransactionsQuery, inventoryParams);

    res.json({
      data: {
        opening_balance: totalOpening,
        current_balance: totalInventory,
        net_movement: netMovement,
        assigned: totalAssigned,
        expended: totalExpended,
        closing_balance: closingBalance,
        recent_transactions: recentResult.rows,
        purchases: totalPurchased,
        transfers_in: totalTransfersIn,
        transfers_out: totalTransfersOut,
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard summary' });
  }
};

export const getNetMovementDetails = async (req, res) => {
  try {
    const { baseId } = req.query;
    
    let baseFilter = '';
    let params = [];
    if (baseId) {
      baseFilter = ' WHERE base_id = $1';
      params = [baseId];
    }

    const purchases = await Purchase.findAll();
    const transfers = await Transfer.findAll();

    const purchasesIn = baseFilter ? purchases.filter(p => p.base_id === parseInt(baseId)) : purchases;
    const transfersIn = baseFilter ? transfers.filter(t => t.to_base_id === parseInt(baseId)) : transfers;
    const transfersOut = baseFilter ? transfers.filter(t => t.from_base_id === parseInt(baseId)) : transfers;

    res.json({
      data: {
        purchases_in: purchasesIn,
        transfers_in: transfersIn,
        transfers_out: transfersOut
      }
    });
  } catch (error) {
    console.error('Net movement details error:', error);
    res.status(500).json({ message: 'Failed to fetch net movement details' });
  }
};

export default { getDashboardSummary, getNetMovementDetails };

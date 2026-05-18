import pool from '../config/database.js';
import Inventory from '../models/Inventory.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';

export const InventoryService = {
  async calculateInventory(baseId, equipmentId) {
    try {
      const inventory = await Inventory.findByBaseAndEquipment(baseId, equipmentId);
      if (!inventory) {
        return { opening_balance: 0, current_balance: 0, net_movement: 0, assigned: 0, expended: 0 };
      }

      const assigned = await Assignment.getTotalAssigned(baseId, equipmentId);
      const expended = await Expenditure.getTotalExpended(baseId, equipmentId);

      const netMovement = inventory.current_balance - inventory.opening_balance;
      const closingBalance = inventory.current_balance - assigned - expended;

      return {
        opening_balance: inventory.opening_balance,
        current_balance: inventory.current_balance,
        net_movement: netMovement,
        assigned,
        expended,
        closing_balance: closingBalance,
      };
    } catch (error) {
      console.error('Inventory calculation error:', error);
      throw error;
    }
  },

  async updateInventoryOnPurchase(baseId, equipmentId, quantity, client = null) {
    const dbClient = client || await pool.connect();
    const manageTx = !client;
    try {
      if (manageTx) await dbClient.query('BEGIN');

      let inventory = await Inventory.findByBaseAndEquipment(baseId, equipmentId, dbClient);

      if (!inventory) {
        inventory = await Inventory.create(baseId, equipmentId, quantity, dbClient);
      } else {
        const newBalance = inventory.current_balance + quantity;
        inventory = await Inventory.updateBalance(baseId, equipmentId, newBalance, dbClient);
      }

      if (manageTx) await dbClient.query('COMMIT');
      return inventory;
    } catch (error) {
      if (manageTx) await dbClient.query('ROLLBACK');
      throw error;
    } finally {
      if (manageTx) dbClient.release();
    }
  },

  async updateInventoryOnTransfer(fromBaseId, toBaseId, equipmentId, quantity, status, client = null) {
    const dbClient = client || await pool.connect();
    const manageTx = !client;
    try {
      if (manageTx) await dbClient.query('BEGIN');

      if (status === 'Completed') {
        const fromInventory = await Inventory.findByBaseAndEquipment(fromBaseId, equipmentId, dbClient);
        if (!fromInventory || fromInventory.current_balance < quantity) {
          throw new Error('Insufficient inventory at source base');
        }

        await Inventory.updateBalance(fromBaseId, equipmentId, fromInventory.current_balance - quantity, dbClient);

        let toInventory = await Inventory.findByBaseAndEquipment(toBaseId, equipmentId, dbClient);
        if (!toInventory) {
          toInventory = await Inventory.create(toBaseId, equipmentId, quantity, dbClient);
        } else {
          toInventory = await Inventory.updateBalance(toBaseId, equipmentId, toInventory.current_balance + quantity, dbClient);
        }

        if (manageTx) await dbClient.query('COMMIT');
        return { fromInventory, toInventory };
      }

      if (manageTx) await dbClient.query('COMMIT');
      return null;
    } catch (error) {
      if (manageTx) await dbClient.query('ROLLBACK');
      throw error;
    } finally {
      if (manageTx) dbClient.release();
    }
  },

  async updateInventoryOnExpenditure(baseId, equipmentId, quantity, client = null) {
    const dbClient = client || await pool.connect();
    const manageTx = !client;
    try {
      if (manageTx) await dbClient.query('BEGIN');

      const inventory = await Inventory.findByBaseAndEquipment(baseId, equipmentId, dbClient);
      if (!inventory || inventory.current_balance < quantity) {
        throw new Error('Insufficient inventory');
      }

      const updatedInventory = await Inventory.updateBalance(baseId, equipmentId, inventory.current_balance - quantity, dbClient);
      if (manageTx) await dbClient.query('COMMIT');
      return updatedInventory;
    } catch (error) {
      if (manageTx) await dbClient.query('ROLLBACK');
      throw error;
    } finally {
      if (manageTx) dbClient.release();
    }
  },

  async updateInventoryOnAssignment(baseId, equipmentId, quantity, client = null) {
    const dbClient = client || await pool.connect();
    const manageTx = !client;
    try {
      if (manageTx) await dbClient.query('BEGIN');

      const inventory = await Inventory.findByBaseAndEquipment(baseId, equipmentId, dbClient);
      if (!inventory) {
        throw new Error('Equipment not found in inventory');
      }

      if (inventory.current_balance < quantity) {
        throw new Error('Insufficient inventory for assignment');
      }

      const updatedInventory = await Inventory.updateBalance(baseId, equipmentId, inventory.current_balance - quantity, dbClient);
      if (manageTx) await dbClient.query('COMMIT');
      return updatedInventory;
    } catch (error) {
      if (manageTx) await dbClient.query('ROLLBACK');
      throw error;
    } finally {
      if (manageTx) dbClient.release();
    }
  }
};

export default InventoryService;

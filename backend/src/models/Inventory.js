import pool from '../config/database.js';

const queryClient = (client) => client || pool;

export const Inventory = {
  findByBaseAndEquipment: async (baseId, equipmentId, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      'SELECT * FROM inventory WHERE base_id = $1 AND equipment_type_id = $2',
      [baseId, equipmentId]
    );
    return result.rows[0];
  },

  findByBase: async (baseId, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      `SELECT i.id, i.base_id, i.equipment_type_id, i.opening_balance, i.current_balance, 
              i.updated_at, et.name, et.category, et.unit
       FROM inventory i
       JOIN equipment_types et ON i.equipment_type_id = et.id
       WHERE i.base_id = $1
       ORDER BY et.name`,
      [baseId]
    );
    return result.rows;
  },

  findAll: async () => {
    const result = await pool.query(
      `SELECT i.id, i.base_id, i.equipment_type_id, i.opening_balance, i.current_balance,
              i.updated_at, b.name as base_name, et.name as equipment_name
       FROM inventory i
       JOIN bases b ON i.base_id = b.id
       JOIN equipment_types et ON i.equipment_type_id = et.id
       ORDER BY b.name, et.name`
    );
    return result.rows;
  },

  create: async (baseId, equipmentId, openingBalance, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      'INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance) VALUES ($1, $2, $3, $3) RETURNING *',
      [baseId, equipmentId, openingBalance]
    );
    return result.rows[0];
  },

  updateBalance: async (baseId, equipmentId, newBalance, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      'UPDATE inventory SET current_balance = $1, updated_at = CURRENT_TIMESTAMP WHERE base_id = $2 AND equipment_type_id = $3 RETURNING *',
      [newBalance, baseId, equipmentId]
    );
    return result.rows[0];
  },

  updateOpeningBalance: async (baseId, equipmentId, newBalance, client = null) => {
    const db = queryClient(client);
    const result = await db.query(
      'UPDATE inventory SET opening_balance = $1, updated_at = CURRENT_TIMESTAMP WHERE base_id = $2 AND equipment_type_id = $3 RETURNING *',
      [newBalance, baseId, equipmentId]
    );
    return result.rows[0];
  }
};

export default Inventory;

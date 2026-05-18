import bcryptjs from 'bcryptjs';
import pool from '../src/config/database.js';

const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Hash passwords
    const adminPassword = await bcryptjs.hash('Admin@123', 10);
    const commanderPassword = await bcryptjs.hash('Commander@123', 10);
    const logisticsPassword = await bcryptjs.hash('Logistics@123', 10);

    // Create bases
    await pool.query('DELETE FROM bases');
    const basesResult = await pool.query(`
      INSERT INTO bases (name, location) VALUES
      ('Alpha Base', 'Northern Region'),
      ('Bravo Base', 'Central Region'),
      ('Charlie Base', 'Southern Region')
      RETURNING id, name
    `);
    const bases = basesResult.rows;
    console.log('Created bases:', bases);

    // Create equipment types
    await pool.query('DELETE FROM equipment_types');
    const equipmentResult = await pool.query(`
      INSERT INTO equipment_types (name, category, unit) VALUES
      ('Rifles', 'Weapons', 'pieces'),
      ('Ammunition', 'Ammunition', 'boxes'),
      ('Armored Vehicles', 'Vehicles', 'units'),
      ('Medical Kits', 'Medical', 'kits'),
      ('Drones', 'Electronics', 'units')
      RETURNING id, name
    `);
    const equipment = equipmentResult.rows;
    console.log('Created equipment:', equipment);

    // Create users
    await pool.query('DELETE FROM users');
    const usersResult = await pool.query(`
      INSERT INTO users (name, email, password, role, assigned_base_id) VALUES
      ('Admin User', 'admin@military.com', $1, 'Admin', NULL),
      ('Commander John', 'commander@military.com', $2, 'Base Commander', $3),
      ('Logistics Officer', 'logistics@military.com', $4, 'Logistics Officer', NULL)
      RETURNING id, name, email, role
    `, [adminPassword, commanderPassword, bases[0].id, logisticsPassword]);
    const users = usersResult.rows;
    console.log('Created users:', users);

    // Create inventory for each base and equipment combination
    await pool.query('DELETE FROM inventory');
    for (const base of bases) {
      for (const eq of equipment) {
        const openingBalance = Math.floor(Math.random() * 100) + 50;
        await pool.query(`
          INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance)
          VALUES ($1, $2, $3, $3)
        `, [base.id, eq.id, openingBalance]);
      }
    }
    console.log('Created inventory for all bases and equipment');

    // Create sample purchases
    await pool.query('DELETE FROM purchases');
    for (let i = 0; i < 10; i++) {
      const baseId = bases[Math.floor(Math.random() * bases.length)].id;
      const equipmentId = equipment[Math.floor(Math.random() * equipment.length)].id;
      const quantity = Math.floor(Math.random() * 50) + 10;
      const purchaseDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      await pool.query(`
        INSERT INTO purchases (base_id, equipment_type_id, quantity, purchase_date, created_by, remarks)
        VALUES ($1, $2, $3, $4, $5, 'Sample purchase')
      `, [baseId, equipmentId, quantity, purchaseDate, users[0].id]);
    }
    console.log('Created sample purchases');

    // Create sample transfers
    await pool.query('DELETE FROM transfers');
    for (let i = 0; i < 5; i++) {
      const fromBase = bases[Math.floor(Math.random() * bases.length)];
      let toBase = bases[Math.floor(Math.random() * bases.length)];
      while (toBase.id === fromBase.id) {
        toBase = bases[Math.floor(Math.random() * bases.length)];
      }
      const equipmentId = equipment[Math.floor(Math.random() * equipment.length)].id;
      const quantity = Math.floor(Math.random() * 20) + 5;
      const transferDate = new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000);

      await pool.query(`
        INSERT INTO transfers (from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, status, created_by, remarks)
        VALUES ($1, $2, $3, $4, $5, 'Completed', $6, 'Sample transfer')
      `, [fromBase.id, toBase.id, equipmentId, quantity, transferDate, users[2].id]);
    }
    console.log('Created sample transfers');

    // Create sample assignments
    await pool.query('DELETE FROM assignments');
    for (let i = 0; i < 8; i++) {
      const baseId = bases[Math.floor(Math.random() * bases.length)].id;
      const equipmentId = equipment[Math.floor(Math.random() * equipment.length)].id;
      const quantity = Math.floor(Math.random() * 10) + 1;
      const assignmentDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000);
      const personnel = ['Soldier ' + Math.floor(Math.random() * 100)];

      await pool.query(`
        INSERT INTO assignments (base_id, equipment_type_id, assigned_to, quantity, assignment_date, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [baseId, equipmentId, personnel[0], quantity, assignmentDate, users[1].id]);
    }
    console.log('Created sample assignments');

    // Create sample expenditures
    await pool.query('DELETE FROM expenditures');
    for (let i = 0; i < 6; i++) {
      const baseId = bases[Math.floor(Math.random() * bases.length)].id;
      const equipmentId = equipment[Math.floor(Math.random() * equipment.length)].id;
      const quantity = Math.floor(Math.random() * 5) + 1;
      const expenditureDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000);
      const reasons = ['Maintenance', 'Training', 'Field Operations', 'Damaged', 'Lost'];

      await pool.query(`
        INSERT INTO expenditures (base_id, equipment_type_id, quantity, reason, expenditure_date, created_by)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [baseId, equipmentId, quantity, reasons[Math.floor(Math.random() * reasons.length)], expenditureDate, users[1].id]);
    }
    console.log('Created sample expenditures');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

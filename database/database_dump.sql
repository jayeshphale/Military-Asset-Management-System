-- Military Asset Management System - Complete Database Dump
-- PostgreSQL Database Dump
-- Generated: May 14, 2026
-- This file contains the complete schema and demo data

-- =====================================================
-- DATABASE SCHEMA
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('Admin', 'Base Commander', 'Logistics Officer')) NOT NULL,
  assigned_base_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bases table
CREATE TABLE IF NOT EXISTS bases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment types table
CREATE TABLE IF NOT EXISTS equipment_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  opening_balance INTEGER DEFAULT 0,
  current_balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(base_id, equipment_type_id)
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  purchase_date DATE NOT NULL,
  remarks TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  from_base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  to_base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  transfer_date DATE NOT NULL,
  status VARCHAR(50) CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed')) DEFAULT 'Pending',
  remarks TEXT,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  assigned_to VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  assignment_date DATE NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenditures table
CREATE TABLE IF NOT EXISTS expenditures (
  id SERIAL PRIMARY KEY,
  base_id INTEGER NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
  equipment_type_id INTEGER NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  reason VARCHAR(255) NOT NULL,
  expenditure_date DATE NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  module_name VARCHAR(100) NOT NULL,
  request_method VARCHAR(10) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  payload JSONB,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_assigned_base_id ON users(assigned_base_id);
CREATE INDEX IF NOT EXISTS idx_inventory_base_id ON inventory(base_id);
CREATE INDEX IF NOT EXISTS idx_inventory_equipment_type_id ON inventory(equipment_type_id);
CREATE INDEX IF NOT EXISTS idx_purchases_base_id ON purchases(base_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_base_id ON transfers(from_base_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_base_id ON transfers(to_base_id);
CREATE INDEX IF NOT EXISTS idx_assignments_base_id ON assignments(base_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_base_id ON expenditures(base_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Add foreign key constraint for users.assigned_base_id
ALTER TABLE users
ADD CONSTRAINT fk_users_assigned_base_id
FOREIGN KEY (assigned_base_id) REFERENCES bases(id) ON DELETE SET NULL;

-- =====================================================
-- DEMO DATA
-- =====================================================

-- Demo Bases
INSERT INTO bases (name, location) VALUES
('Alpha Base', 'Northern Region'),
('Bravo Base', 'Central Region'),
('Charlie Base', 'Southern Region')
ON CONFLICT (name) DO NOTHING;

-- Demo Equipment Types
INSERT INTO equipment_types (name, category, unit) VALUES
('Rifles', 'Weapons', 'pieces'),
('Ammunition', 'Ammunition', 'boxes'),
('Armored Vehicles', 'Vehicles', 'units'),
('Medical Kits', 'Medical', 'kits'),
('Drones', 'Electronics', 'units')
ON CONFLICT (name) DO NOTHING;

-- Demo Users (Passwords are bcrypt hashed - replace with actual hashes in production)
-- Admin: admin@military.com / Admin@123
-- Commander: commander@military.com / Commander@123
-- Logistics: logistics@military.com / Logistics@123
INSERT INTO users (name, email, password, role, assigned_base_id) VALUES
('Admin User', 'admin@military.com', '$2a$10$example.hash.for.Admin@123', 'Admin', NULL),
('Commander John', 'commander@military.com', '$2a$10$example.hash.for.Commander@123', 'Base Commander', 1),
('Logistics Officer', 'logistics@military.com', '$2a$10$example.hash.for.Logistics@123', 'Logistics Officer', NULL)
ON CONFLICT (email) DO NOTHING;

-- Demo Inventory
INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance) VALUES
(1, 1, 75, 75), (1, 2, 120, 120), (1, 3, 45, 45), (1, 4, 85, 85), (1, 5, 65, 65),
(2, 1, 90, 90), (2, 2, 95, 95), (2, 3, 55, 55), (2, 4, 70, 70), (2, 5, 80, 80),
(3, 1, 60, 60), (3, 2, 110, 110), (3, 3, 40, 40), (3, 4, 95, 95), (3, 5, 50, 50)
ON CONFLICT (base_id, equipment_type_id) DO NOTHING;

-- Demo Purchases
INSERT INTO purchases (base_id, equipment_type_id, quantity, purchase_date, created_by, remarks) VALUES
(1, 1, 25, '2026-04-15', 1, 'Monthly rifle procurement'),
(1, 2, 40, '2026-04-20', 1, 'Ammunition restock'),
(2, 3, 15, '2026-04-18', 1, 'Vehicle maintenance'),
(2, 4, 30, '2026-04-22', 1, 'Medical supplies'),
(3, 5, 20, '2026-04-25', 1, 'Drone equipment'),
(1, 1, 35, '2026-05-01', 1, 'Additional rifles'),
(2, 2, 25, '2026-05-05', 1, 'Emergency ammunition'),
(3, 3, 10, '2026-05-08', 1, 'Vehicle replacement'),
(1, 4, 45, '2026-05-10', 1, 'Medical kit expansion'),
(2, 5, 15, '2026-05-12', 1, 'Drone upgrade')
ON CONFLICT DO NOTHING;

-- Demo Transfers
INSERT INTO transfers (from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, status, created_by, remarks) VALUES
(1, 2, 1, 10, '2026-04-20', 'Completed', 3, 'Reinforcement support'),
(2, 3, 2, 15, '2026-04-25', 'Completed', 3, 'Regional redistribution'),
(3, 1, 3, 5, '2026-05-01', 'Completed', 3, 'Equipment sharing'),
(1, 3, 4, 20, '2026-05-05', 'Completed', 3, 'Medical aid'),
(2, 1, 5, 8, '2026-05-10', 'Completed', 3, 'Technology transfer')
ON CONFLICT DO NOTHING;

-- Demo Assignments
INSERT INTO assignments (base_id, equipment_type_id, assigned_to, quantity, assignment_date, created_by) VALUES
(1, 1, 'Soldier Alpha-1', 5, '2026-04-15', 2),
(1, 1, 'Soldier Alpha-2', 3, '2026-04-16', 2),
(2, 2, 'Soldier Bravo-1', 8, '2026-04-18', 2),
(2, 3, 'Soldier Bravo-2', 2, '2026-04-20', 2),
(3, 4, 'Soldier Charlie-1', 12, '2026-04-22', 2),
(3, 5, 'Soldier Charlie-2', 6, '2026-04-25', 2),
(1, 2, 'Soldier Alpha-3', 15, '2026-05-01', 2),
(2, 1, 'Soldier Bravo-3', 4, '2026-05-05', 2)
ON CONFLICT DO NOTHING;

-- Demo Expenditures
INSERT INTO expenditures (base_id, equipment_type_id, quantity, reason, expenditure_date, created_by) VALUES
(1, 1, 2, 'Training', '2026-04-10', 2),
(2, 2, 3, 'Field Operations', '2026-04-12', 2),
(3, 3, 1, 'Maintenance', '2026-04-15', 2),
(1, 4, 5, 'Medical Use', '2026-04-18', 2),
(2, 5, 2, 'Damaged', '2026-04-20', 2),
(3, 1, 1, 'Lost', '2026-04-25', 2)
ON CONFLICT DO NOTHING;

-- Demo Audit Logs
INSERT INTO audit_logs (user_id, action, module_name, request_method, endpoint, payload, ip_address) VALUES
(1, 'LOGIN', 'auth', 'POST', '/api/auth/login', '{"email": "admin@military.com"}', '192.168.1.100'),
(2, 'CREATE_ASSIGNMENT', 'assignments', 'POST', '/api/assignments', '{"base_id": 1, "equipment_type_id": 1}', '192.168.1.101'),
(3, 'CREATE_TRANSFER', 'transfers', 'POST', '/api/transfers', '{"from_base_id": 1, "to_base_id": 2}', '192.168.1.102'),
(1, 'VIEW_USERS', 'users', 'GET', '/api/users', '{}', '192.168.1.100'),
(2, 'VIEW_ASSIGNMENTS', 'assignments', 'GET', '/api/assignments', '{}', '192.168.1.101')
ON CONFLICT DO NOTHING;

-- =====================================================
-- END OF DATABASE DUMP
-- =====================================================
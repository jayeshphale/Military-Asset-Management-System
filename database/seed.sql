-- Military Asset Management System Seed Data
-- PostgreSQL Seed Data
-- Generated: May 14, 2026

-- =====================================================
-- DEMO BASES
-- =====================================================
INSERT INTO bases (name, location) VALUES
('Alpha Base', 'Northern Region'),
('Bravo Base', 'Central Region'),
('Charlie Base', 'Southern Region')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- DEMO EQUIPMENT TYPES
-- =====================================================
INSERT INTO equipment_types (name, category, unit) VALUES
('Rifles', 'Weapons', 'pieces'),
('Ammunition', 'Ammunition', 'boxes'),
('Armored Vehicles', 'Vehicles', 'units'),
('Medical Kits', 'Medical', 'kits'),
('Drones', 'Electronics', 'units')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- DEMO USERS (Passwords are hashed)
-- =====================================================
-- Admin User: admin@military.com / Admin@123
INSERT INTO users (name, email, password, role, assigned_base_id) VALUES
('Admin User', 'admin@military.com', '$2a$10$example.hash.for.Admin@123', 'Admin', NULL)
ON CONFLICT (email) DO NOTHING;

-- Base Commander: commander@military.com / Commander@123
INSERT INTO users (name, email, password, role, assigned_base_id) VALUES
('Commander John', 'commander@military.com', '$2a$10$example.hash.for.Commander@123', 'Base Commander', 1)
ON CONFLICT (email) DO NOTHING;

-- Logistics Officer: logistics@military.com / Logistics@123
INSERT INTO users (name, email, password, role, assigned_base_id) VALUES
('Logistics Officer', 'logistics@military.com', '$2a$10$example.hash.for.Logistics@123', 'Logistics Officer', NULL)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DEMO INVENTORY DATA
-- =====================================================
-- Alpha Base Inventory
INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance) VALUES
(1, 1, 75, 75), -- Rifles
(1, 2, 120, 120), -- Ammunition
(1, 3, 45, 45), -- Armored Vehicles
(1, 4, 85, 85), -- Medical Kits
(1, 5, 65, 65) -- Drones
ON CONFLICT (base_id, equipment_type_id) DO NOTHING;

-- Bravo Base Inventory
INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance) VALUES
(2, 1, 90, 90), -- Rifles
(2, 2, 95, 95), -- Ammunition
(2, 3, 55, 55), -- Armored Vehicles
(2, 4, 70, 70), -- Medical Kits
(2, 5, 80, 80) -- Drones
ON CONFLICT (base_id, equipment_type_id) DO NOTHING;

-- Charlie Base Inventory
INSERT INTO inventory (base_id, equipment_type_id, opening_balance, current_balance) VALUES
(3, 1, 60, 60), -- Rifles
(3, 2, 110, 110), -- Ammunition
(3, 3, 40, 40), -- Armored Vehicles
(3, 4, 95, 95), -- Medical Kits
(3, 5, 50, 50) -- Drones
ON CONFLICT (base_id, equipment_type_id) DO NOTHING;

-- =====================================================
-- DEMO PURCHASES
-- =====================================================
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

-- =====================================================
-- DEMO TRANSFERS
-- =====================================================
INSERT INTO transfers (from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, status, created_by, remarks) VALUES
(1, 2, 1, 10, '2026-04-20', 'Completed', 3, 'Reinforcement support'),
(2, 3, 2, 15, '2026-04-25', 'Completed', 3, 'Regional redistribution'),
(3, 1, 3, 5, '2026-05-01', 'Completed', 3, 'Equipment sharing'),
(1, 3, 4, 20, '2026-05-05', 'Completed', 3, 'Medical aid'),
(2, 1, 5, 8, '2026-05-10', 'Completed', 3, 'Technology transfer')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DEMO ASSIGNMENTS
-- =====================================================
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

-- =====================================================
-- DEMO EXPENDITURES
-- =====================================================
INSERT INTO expenditures (base_id, equipment_type_id, quantity, reason, expenditure_date, created_by) VALUES
(1, 1, 2, 'Training', '2026-04-10', 2),
(2, 2, 3, 'Field Operations', '2026-04-12', 2),
(3, 3, 1, 'Maintenance', '2026-04-15', 2),
(1, 4, 5, 'Medical Use', '2026-04-18', 2),
(2, 5, 2, 'Damaged', '2026-04-20', 2),
(3, 1, 1, 'Lost', '2026-04-25', 2)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DEMO AUDIT LOGS
-- =====================================================
INSERT INTO audit_logs (user_id, action, module_name, request_method, endpoint, payload, ip_address) VALUES
(1, 'LOGIN', 'auth', 'POST', '/api/auth/login', '{"email": "admin@military.com"}', '192.168.1.100'),
(2, 'CREATE_ASSIGNMENT', 'assignments', 'POST', '/api/assignments', '{"base_id": 1, "equipment_type_id": 1}', '192.168.1.101'),
(3, 'CREATE_TRANSFER', 'transfers', 'POST', '/api/transfers', '{"from_base_id": 1, "to_base_id": 2}', '192.168.1.102'),
(1, 'VIEW_USERS', 'users', 'GET', '/api/users', '{}', '192.168.1.100'),
(2, 'VIEW_ASSIGNMENTS', 'assignments', 'GET', '/api/assignments', '{}', '192.168.1.101')
ON CONFLICT DO NOTHING;
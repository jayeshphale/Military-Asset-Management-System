// Database schema SQL file
// Run this to create all tables

export const schema = `
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
`;

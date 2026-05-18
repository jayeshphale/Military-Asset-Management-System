# Military Asset Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)

A comprehensive full-stack web application for managing military equipment inventory across multiple bases. Built with modern technologies and featuring role-based access control (RBAC) for secure operations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [RBAC Overview](#rbac-overview)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Demo Credentials](#demo-credentials)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)

## ✨ Features

### Core Functionality
- **Multi-Base Inventory Management**: Track equipment across Alpha, Bravo, and Charlie bases
- **Real-time Dashboard**: Comprehensive metrics and data visualization
- **Equipment Lifecycle Tracking**: Purchases, transfers, assignments, and expenditures
- **Audit Logging**: Complete audit trail for all operations
- **Role-Based Access Control**: Secure access based on user roles

### User Roles & Permissions
- **Admin**: Full system access, user management, all operations
- **Base Commander**: Operational management of assigned base
- **Logistics Officer**: Procurement and logistics operations

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-documented API endpoints
- **Responsive Design**: Mobile-friendly interface
- **Data Visualization**: Charts and analytics
- **Real-time Updates**: Live inventory tracking

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 13+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod schemas
- **Security**: Helmet, CORS
- **Logging**: Morgan

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### DevOps & Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: NeonDB / Supabase
- **Version Control**: Git

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Express API   │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Services      │    │ • Routes        │    │ • Bases         │
│ • Context       │    │ • Middleware    │    │ • Equipment     │
│ • Hooks         │    │ • Models        │    │ • Inventory     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### System Workflow
1. **Authentication**: JWT-based login with role assignment
2. **Authorization**: Middleware validates user permissions
3. **Data Operations**: CRUD operations with audit logging
4. **Inventory Updates**: Automatic balance calculations
5. **Reporting**: Real-time dashboard with analytics

## 📁 Project Structure

```
military-asset-management/
│
├── frontend/                          # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API services
│   │   ├── context/                  # React context
│   │   ├── hooks/                    # Custom hooks
│   │   └── layouts/                  # Layout components
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           # Express API
│   ├── src/
│   │   ├── controllers/              # Route handlers
│   │   ├── models/                   # Database models
│   │   ├── routes/                   # API routes
│   │   ├── middleware/               # Custom middleware
│   │   ├── services/                 # Business logic
│   │   ├── validators/               # Input validation
│   │   └── config/                   # Configuration
│   ├── database/                     # Database scripts
│   ├── package.json
│   └── .env.example
│
├── database/                          # Database files
│   ├── schema.sql                    # Database schema
│   ├── seed.sql                      # Demo data
│   └── database_dump.sql             # Complete dump
│
├── docs/                             # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── PROJECT_OVERVIEW.md
│   ├── RBAC_EXPLANATION.md
│   └── VIDEO_WALKTHROUGH_SCRIPT.md
│
├── postman/                          # API testing
│   └── Military_Asset_Management.postman_collection.json
│
├── .env.example                      # Environment template
├── README.md                         # This file
└── package-info.txt                  # Project info
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd military-asset-management
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🌐 Deployed Links

- **Frontend (Vercel)**: https://military-asset-management-system-rose.vercel.app
- **Backend API (Render)**: https://military-asset-management-system-6o0u.onrender.com


## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=military_assets
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication
```
POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "message": "Login successful", "token": "jwt", "user": {...} }
```

### Core Endpoints
- `GET /api/dashboard/summary` - Dashboard metrics
- `GET /api/users` - User management (Admin only)
- `GET /api/bases` - Base information
- `GET /api/equipment` - Equipment types
- `GET /api/inventory` - Inventory by base
- `GET /api/purchases` - Purchase history
- `GET /api/transfers` - Transfer records
- `GET /api/assignments` - Equipment assignments
- `GET /api/expenditures` - Expenditure records
- `GET /api/audit-logs` - Audit trail (Admin only)

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.

## 🔐 RBAC Overview

### User Roles
1. **Admin**
   - Full system access
   - User management
   - All CRUD operations
   - Audit log access

2. **Base Commander**
   - Dashboard access
   - Inventory viewing
   - Assignment management
   - Expenditure tracking

3. **Logistics Officer**
   - Dashboard access
   - Purchase management
   - Transfer operations
   - Inventory monitoring

### Access Control
- JWT token validation
- Role-based middleware
- Frontend route protection
- API endpoint restrictions

See [docs/RBAC_EXPLANATION.md](docs/RBAC_EXPLANATION.md) for detailed explanation.

## 🗄 Database Schema

### Core Tables
- **users**: User accounts with roles
- **bases**: Military base locations
- **equipment_types**: Equipment categories
- **inventory**: Stock levels by base
- **purchases**: Procurement records
- **transfers**: Inter-base movements
- **assignments**: Equipment issued to personnel
- **expenditures**: Equipment usage/consumption
- **audit_logs**: System activity tracking

### Relationships
```
users (1) ──── (many) purchases/transfers/assignments/expenditures
bases (1) ──── (many) inventory/purchases/transfers/assignments/expenditures
equipment_types (1) ──── (many) inventory/purchases/transfers/assignments/expenditures
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render)
```bash
# Deploy backend/ folder to Render
# Set environment variables in Render dashboard
```

### Database (NeonDB)
```bash
# Create database on NeonDB
# Run schema.sql and seed.sql
# Update connection string in backend .env
```

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@military.com | Admin@123 |
| Base Commander | commander@military.com | Commander@123 |
| Logistics Officer | logistics@military.com | Logistics@123 |

## 📸 Screenshots

### Login Page
![Login Page](https://via.placeholder.com/800x600?text=Login+Page)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x600?text=Admin+Dashboard)

### Inventory Management
![Inventory Management](https://via.placeholder.com/800x600?text=Inventory+Management)

### User Management (Admin Only)
![User Management](https://via.placeholder.com/800x600?text=User+Management)

## 🔮 Future Improvements

### Short Term
- [ ] Email notifications for transfers
- [ ] Advanced reporting and analytics
- [ ] Bulk import/export functionality
- [ ] Mobile app companion

### Long Term
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Advanced audit features
- [ ] Integration with external systems
- [ ] Machine learning for demand forecasting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for military logistics excellence**
- **Transfers**: Move assets between bases with approval workflows
- **Assignments**: Assign equipment to personnel
- **Expenditures**: Record consumption and disposal of assets
- **Audit Logging**: Track all transactions for compliance

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios for API calls
- Recharts for visualizations
- React Hook Form for form handling
- Zod for validation

**Backend:**
- Node.js + Express.js
- PostgreSQL relational database
- JWT authentication
- bcryptjs for password hashing
- Helmet for security
- Morgan for logging

## 📊 Database Schema

### Core Tables

```
users - User accounts with roles and base assignments
bases - Military bases/locations
equipment_types - Equipment catalog
inventory - Stock levels per base and equipment
purchases - Purchase transactions
transfers - Inter-base asset transfers
assignments - Equipment assignments to personnel
expenditures - Asset consumption/disposal records
audit_logs - Transaction audit trail
```

## 👥 User Roles & Permissions

### 1. Admin
- Full system access
- Manage users, bases, equipment
- View all purchases, transfers, assignments, expenditures
- Access audit logs
- Create and delete records

### 2. Base Commander
- Access only assigned base's inventory
- View inventory for base
- Create assignments for personnel
- Record expenditures
- Cannot access other bases or user management

### 3. Logistics Officer
- Manage purchases across bases
- Handle inter-base transfers
- View inventory
- Cannot access user management or audit logs

## 🔐 Security Features

- ✅ JWT-based authentication with expiry
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control (RBAC) middleware
- ✅ Protected API endpoints
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Comprehensive audit logging

## 📋 Inventory Formula

```
Opening Balance = Previous Closing Balance
Net Movement = Purchases + Transfer In - Transfer Out
Closing Balance = Opening Balance + Net Movement - Assigned - Expended
```

Database transactions ensure consistency when updating balances.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Clone and navigate:**
```bash
cd backend
npm install
```

2. **Configure environment (.env):**
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=military_assets
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

3. **Initialize database:**
```bash
node database/migrate.js
```

4. **Seed sample data:**
```bash
npm run seed
```

5. **Start development server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate and install:**
```bash
cd frontend
npm install
```

2. **Create .env:**
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Demo Credentials

```
Admin:
Email: admin@military.com
Password: Admin@123

Base Commander:
Email: commander@military.com
Password: Commander@123

Logistics Officer:
Email: logistics@military.com
Password: Logistics@123
```

## 📚 API Documentation

### Authentication

**Login**
```
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

### Users (Admin only)

```
GET /api/users
GET /api/users/:id
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id
```

### Bases (Admin only)

```
GET /api/bases
GET /api/bases/:id
POST /api/bases
PUT /api/bases/:id
DELETE /api/bases/:id
```

### Equipment (Admin only)

```
GET /api/equipment
GET /api/equipment/:id
POST /api/equipment
PUT /api/equipment/:id
DELETE /api/equipment/:id
```

### Purchases (Admin, Logistics Officer)

```
GET /api/purchases
GET /api/purchases/:id
GET /api/purchases/base/:baseId
POST /api/purchases
```

### Transfers (Admin, Logistics Officer)

```
GET /api/transfers
GET /api/transfers/:id
GET /api/transfers/base/:baseId
POST /api/transfers
PUT /api/transfers/:id/status
```

### Assignments (Admin, Base Commander)

```
GET /api/assignments
GET /api/assignments/:id
GET /api/assignments/base/:baseId
POST /api/assignments
```

### Expenditures (Admin, Base Commander)

```
GET /api/expenditures
GET /api/expenditures/:id
GET /api/expenditures/base/:baseId
POST /api/expenditures
```

### Dashboard

```
GET /api/dashboard/summary
GET /api/dashboard/net-movement
```

### Audit Logs (Admin only)

```
GET /api/audit-logs?page=1&limit=50
GET /api/audit-logs/user/:userId
GET /api/audit-logs/range?startDate=2024-01-01&endDate=2024-12-31
```

## 🗂️ Project Structure

```
military-asset-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── config/
│   │   └── app.js
│   ├── database/
│   │   ├── schema.js
│   │   ├── migrate.js
│   │   └── seed.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🎨 UI Features

- **Military-themed dark interface** with green accents
- **Responsive design** for desktop and mobile
- **Real-time charts** showing inventory trends
- **Modal dialogs** for forms and confirmations
- **Sortable tables** with pagination
- **Toast notifications** for user feedback
- **Loading states** for async operations
- **Error handling** with user-friendly messages

## 📊 Dashboard Features

- **Summary Cards**: Opening/Closing balances, Net movement, Assigned, Expended
- **Inventory Overview Chart**: Visual representation of stock levels
- **Distribution Pie Chart**: Breakdown of available vs assigned vs expended
- **Recent Transactions**: Latest system activities
- **Net Movement Modal**: Detailed view of purchases and transfers

## 🔄 Business Logic

### Inventory Updates

**On Purchase:**
- Increment current balance
- Update inventory automatically

**On Transfer:**
- Decrement source base inventory
- Increment destination base inventory
- Validate sufficient stock
- Prevent same-base transfers

**On Assignment:**
- Track assigned quantities
- Calculated in closing balance

**On Expenditure:**
- Decrement current balance
- Record reason and date
- Validate sufficient stock

All operations use database transactions for ACID compliance.

## 📝 Seed Data

System comes pre-populated with:

**Bases:**
- Alpha Base (Northern Region)
- Bravo Base (Central Region)
- Charlie Base (Southern Region)

**Equipment:**
- Rifles
- Ammunition
- Armored Vehicles
- Medical Kits
- Drones

**Sample Transactions:**
- 10 purchases
- 5 transfers
- 8 assignments
- 6 expenditures

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_API_URL=<backend_url>`
4. Deploy

### Backend Deployment (Render)

1. Push code to GitHub
2. Create PostgreSQL database on Render or Supabase
3. Create Web Service on Render
4. Set environment variables
5. Deploy

### Database (Supabase / NeonDB)

1. Create PostgreSQL instance
2. Run schema migration script
3. Update DB connection string
4. Run seed data script

## 📄 API Response Format

**Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "message": "Error description",
  "errors": [...]
}
```

## 🧪 Testing the System

1. **Login** with demo credentials
2. **View Dashboard** - Check inventory summaries
3. **Create Purchase** - Add equipment to inventory
4. **Create Transfer** - Move assets between bases
5. **Create Assignment** - Assign to personnel
6. **Create Expenditure** - Record consumption
7. **View Audit Logs** (Admin) - Check all transactions
8. **Manage Users** (Admin) - Add/edit users

## 📱 Mobile Support

- Responsive sidebar (collapsible on mobile)
- Touch-friendly buttons and forms
- Optimized table views for small screens
- Mobile-friendly modal dialogs

## 🔧 Troubleshooting

**Database Connection Error:**
- Verify PostgreSQL is running
- Check .env credentials
- Ensure database exists

**CORS Errors:**
- Verify CORS_ORIGIN in backend .env
- Check frontend API URL

**Authentication Fails:**
- Verify JWT_SECRET is set
- Check token expiry
- Clear localStorage and re-login

## 📊 Performance Features

- Indexed database queries
- Pagination on audit logs
- Optimized SQL queries
- React lazy loading
- Chart rendering optimization

## 🔐 Audit Trail

Every action is logged including:
- User who performed action
- Action type (CREATE, READ, UPDATE, DELETE)
- Module affected
- Timestamp
- IP address
- Request payload

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT Documentation](https://jwt.io)

## 📝 License

MIT License - Open for educational and commercial use

## 👨‍💻 Author

Full-Stack Military Asset Management System
Built with modern technologies and best practices

---

**Status:** ✅ Production Ready | **Version:** 1.0.0

# Quick Start Guide

## Prerequisites

- Node.js v16+ and npm/yarn
- PostgreSQL 12+
- Git

## 5-Minute Setup

### 1. Clone Repository
```bash
cd military-asset-management
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your PostgreSQL credentials
```

**Update .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=military_assets
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. Create Database
```bash
# Using psql
createdb military_assets

# Or in psql:
CREATE DATABASE military_assets;
```

### 4. Initialize Schema & Seed Data
```bash
# From backend directory
npm run migrate
npm run seed
```

### 5. Start Backend
```bash
npm run dev
```

Backend running on: `http://localhost:5000`

### 6. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend running on: `http://localhost:5173`

### 7. Login
Open browser → `http://localhost:5173`

**Demo Credentials:**
- Email: `admin@military.com`
- Password: `Admin@123`

---

## 🎯 First Steps After Login

1. **View Dashboard** - Check inventory overview
2. **Create Equipment** - Go to Equipment (if Admin)
3. **Create Purchase** - Add new asset
4. **Create Transfer** - Move between bases
5. **View Audit Logs** - Track activities

## 📁 Project Structure

```
military-asset-management/
├── backend/              # Express API server
│   ├── src/
│   ├── database/
│   └── package.json
├── frontend/             # React application
│   ├── src/
│   └── package.json
├── README.md            # Full documentation
├── API_DOCUMENTATION.md # API reference
└── DEPLOYMENT_GUIDE.md  # Production setup
```

## 🔧 Common Commands

### Backend
```bash
npm run dev      # Start development server
npm run seed     # Seed sample data
npm run migrate  # Initialize database
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify .env credentials
cat backend/.env
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001

# Or kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
- Verify backend CORS_ORIGIN in .env
- Frontend must match exactly

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [README.md](./README.md) - Full project overview
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoint reference
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment

## 🚀 Next Steps

1. **Customize** - Modify equipment types, bases for your needs
2. **Deploy** - Follow DEPLOYMENT_GUIDE.md for production
3. **Integrate** - Connect to existing systems via API
4. **Monitor** - Set up audit log reviews

## 💡 Tips

- Use Postman collection for API testing
- Admin account created in seed has full access
- All timestamps in UTC
- Transactions automatically validated

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API_DOCUMENTATION.md
3. Check application logs

---

**Enjoy managing your military assets!** 🎖️

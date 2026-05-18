#!/bin/bash

# Military Asset Management System - Complete Setup Script

echo "🎖️ Military Asset Management System - Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 12+ first."
    exit 1
fi

echo "✅ Node.js and PostgreSQL found"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend
npm install
cp .env.example .env
echo "   ⚠️  Please edit backend/.env with your PostgreSQL credentials"
echo "   Run: npm run migrate (to create database)"
echo "   Run: npm run seed (to populate sample data)"
echo "   Run: npm run dev (to start backend)"
cd ..
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd frontend
npm install
cp .env.example .env
echo "   Run: npm run dev (to start frontend)"
cd ..
echo ""

echo "✅ Setup Complete!"
echo ""
echo "🚀 Next Steps:"
echo "   1. Edit backend/.env with PostgreSQL credentials"
echo "   2. cd backend && npm run migrate"
echo "   3. npm run seed"
echo "   4. npm run dev"
echo ""
echo "   5. In another terminal: cd frontend && npm run dev"
echo "   6. Open http://localhost:5173"
echo ""
echo "🔐 Demo Credentials:"
echo "   Admin: admin@military.com / Admin@123"
echo "   Commander: commander@military.com / Commander@123"
echo "   Logistics: logistics@military.com / Logistics@123"
echo ""

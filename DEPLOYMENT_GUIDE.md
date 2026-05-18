# Deployment Guide

## Production Deployment Architecture

```
┌─────────────────────┐
│   Vercel Frontend   │
│   (React + Vite)    │
└──────────┬──────────┘
           │ HTTPS
           │
┌──────────▼──────────┐
│   Render Backend    │
│  (Node + Express)   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Supabase/NeonDB    │
│   PostgreSQL        │
└─────────────────────┘
```

## Prerequisites for Deployment

- GitHub account with repository
- Vercel account (for frontend)
- Render account (for backend)
- Supabase or NeonDB account (for database)

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/military-asset-management.git
git push -u origin main
```

### Step 2: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import Git Repository (select your GitHub repo)
4. Select `frontend` folder as root
5. Set environment variables:
   ```
   VITE_API_URL=https://military-asset-backend.onrender.com/api
   ```
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. In Vercel project settings
2. Go to Domains
3. Add your custom domain
4. Follow DNS configuration

## Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

**Option A: Render PostgreSQL**
1. Go to [Render.com](https://render.com)
2. Click "New +"
3. Select "PostgreSQL"
4. Choose plan and region
5. Create database
6. Note connection string

**Option B: Supabase**
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Wait for database provisioning
4. Go to Settings > Database
5. Copy connection string

### Step 2: Run Database Schema

```bash
# Connect to remote database
psql postgresql://username:password@host:port/dbname

# Run schema from database/schema.js
\i schema.sql

# Exit
\q
```

### Step 3: Deploy Backend on Render

1. Go to [Render.com](https://render.com)
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub repository
5. Configure settings:
   - **Name:** military-asset-backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Set environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   
   DB_HOST=your-db-host
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_DIALECT=postgres
   
   JWT_SECRET=your-very-long-secret-key-change-this
   JWT_EXPIRY=7d
   
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   LOG_LEVEL=info
   ```
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)

### Step 3.5: Seed Production Database

After backend deploys:

```bash
# SSH into Render container or use local connection
psql postgresql://username:password@host:port/dbname

# Run seed data
\i seed.sql
```

Or via Node:
```bash
# Temporarily modify seed.js to connect to production database
NODE_ENV=production node database/seed.js
```

## Database Backup & Recovery

### Automated Backups

**Supabase:** Automatic daily backups included

**Render PostgreSQL:** Enable daily backups in database settings

### Manual Backup

```bash
# Backup
pg_dump postgresql://username:password@host:port/dbname > backup.sql

# Restore
psql postgresql://username:password@host:port/dbname < backup.sql
```

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url/api
```

### Backend (.env.production)
```
NODE_ENV=production
PORT=5000

# Database
DB_HOST=prod-db-host
DB_PORT=5432
DB_NAME=prod_military_assets
DB_USER=postgres
DB_PASSWORD=strong_password_here
DB_DIALECT=postgres

# JWT
JWT_SECRET=very-long-random-string-minimum-32-chars
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=https://your-frontend-url.vercel.app

# Logging
LOG_LEVEL=info
```

## SSL/TLS Certificates

- **Vercel:** Automatic HTTPS with Let's Encrypt
- **Render:** Automatic HTTPS with Let's Encrypt
- **Supabase:** Automatic HTTPS

## Monitoring & Logging

### Backend Logs

**Render:**
- View in Render dashboard → Logs tab
- Real-time streaming
- History available

### Database Monitoring

**Supabase:**
- Settings → Database
- View connection logs
- Monitor performance

**Render:**
- Database dashboard
- View stats and connections

### Application Monitoring (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/node
```

```javascript
// In app.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

## CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm run build
```

## Security Checklist

- ✅ Change JWT_SECRET in production
- ✅ Use strong database passwords
- ✅ Enable SSL/TLS (automatic on Vercel/Render)
- ✅ Set CORS_ORIGIN to exact frontend URL
- ✅ Configure firewall rules
- ✅ Enable database backups
- ✅ Use environment variables (never hardcode secrets)
- ✅ Set LOG_LEVEL to 'info' or higher in production
- ✅ Monitor audit logs regularly
- ✅ Keep dependencies updated

## Performance Optimization

### Database

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM inventory;

-- Rebuild indexes
REINDEX DATABASE military_assets;

-- Vacuum for cleanup
VACUUM ANALYZE;
```

### Backend

```javascript
// Enable gzip compression
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Frontend

- Enable Build Optimization in Vite
- Use code splitting for routes
- Optimize images
- Enable gzip on Vercel (automatic)

## Scaling Strategy

### Vertical Scaling
- Increase Render dyno size
- Upgrade database plan

### Horizontal Scaling (Future)
- Add load balancer
- Deploy multiple backend instances
- Use connection pooling
- Implement caching layer (Redis)

## Rollback Procedure

### Frontend (Vercel)
1. Go to Deployments tab
2. Click rollback
3. Confirm

### Backend (Render)
1. Go to Deploys tab
2. Click previous deploy
3. Click "Deploy" to restore

## Troubleshooting

### Connection Issues
```bash
# Test database connection
psql postgresql://user:pass@host:port/dbname

# Test backend
curl https://backend-url/health
```

### CORS Errors
- Check CORS_ORIGIN matches frontend URL
- Include protocol (https://)

### Database Errors
- Check connection string
- Verify firewall rules allow Render IP
- Ensure database exists

### High Memory Usage
- Check for connection leaks
- Analyze long-running queries
- Increase dyno size

## Cost Estimation (Monthly)

- **Vercel Frontend:** $0-20 (free tier available)
- **Render Backend:** $7-50 depending on compute
- **Supabase Database:** $25+ depending on usage

## Support & Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

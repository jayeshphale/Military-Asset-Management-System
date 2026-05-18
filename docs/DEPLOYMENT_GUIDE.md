# Military Asset Management System - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Military Asset Management System to production environments.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Render        │    │   NeonDB        │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- GitHub account
- Vercel account
- Render account
- NeonDB account (or Supabase)
- Domain name (optional)

## 1. Database Setup (NeonDB)

### Step 1: Create NeonDB Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### Step 2: Create Database
1. In NeonDB dashboard, create a new database
2. Name it `military_assets`
3. Note down the connection string

### Step 3: Run Schema and Seed Data
1. Connect to your NeonDB database using psql or any PostgreSQL client
2. Run the schema.sql file:
```sql
-- Execute contents of database/schema.sql
```
3. Run the seed.sql file:
```sql
-- Execute contents of database/seed.sql
```

### Step 4: Verify Database
```sql
-- Check if tables were created
\dt

-- Check if data was seeded
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM bases;
SELECT COUNT(*) FROM equipment_types;
```

## 2. Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment
1. Ensure all dependencies are in package.json
2. Create production build script if needed
3. Update CORS settings for production domain

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a free account
3. Connect your GitHub account

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure build settings:
   - **Name**: `military-assets-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_CONNECTION_STRING=postgresql://user:password@host/database
   JWT_SECRET=your-super-secret-jwt-key-here
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```
5. Click "Create Web Service"

### Step 4: Verify Backend Deployment
1. Wait for deployment to complete
2. Note the backend URL (e.g., `https://military-assets-backend.onrender.com`)
3. Test the health endpoint: `GET /api/health`

## 3. Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment
1. Update API base URL in environment variables
2. Ensure build scripts are correct
3. Add production environment variables

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your repository

### Step 3: Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables:
   ```
   VITE_API_URL=https://military-assets-backend.onrender.com/api
   ```
5. Click "Deploy"

### Step 4: Verify Frontend Deployment
1. Wait for deployment to complete
2. Note the frontend URL (e.g., `https://military-assets.vercel.app`)
3. Test the application login

## 4. Environment Variables Configuration

### Backend Environment Variables
```env
# Production Environment
NODE_ENV=production
PORT=10000

# Database
DB_CONNECTION_STRING=postgresql://user:password@host/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Security (Optional)
SESSION_SECRET=another-long-random-secret
BCRYPT_ROUNDS=12
```

### Frontend Environment Variables
```env
# API Configuration
VITE_API_URL=https://military-assets-backend.onrender.com/api

# Optional: Analytics, etc.
# VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
```

## 5. Domain Configuration (Optional)

### Custom Domain for Frontend
1. In Vercel dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Custom Domain for Backend
1. In Render dashboard, go to your service
2. Navigate to "Settings" → "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## 6. SSL Certificates

- **Vercel**: Automatic SSL certificates included
- **Render**: Automatic SSL certificates included
- **NeonDB**: SSL connections enabled by default

## 7. Monitoring and Maintenance

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check Vercel deployment status

### Logs
- **Backend**: View logs in Render dashboard
- **Frontend**: View logs in Vercel dashboard
- **Database**: Monitor queries in NeonDB dashboard

### Backups
- **Database**: NeonDB provides automatic backups
- **Code**: GitHub repository serves as code backup

## 8. Scaling Considerations

### Database Scaling
- NeonDB automatically scales compute resources
- Monitor query performance and optimize slow queries
- Consider read replicas for high-traffic applications

### Backend Scaling
- Render automatically scales based on traffic
- Monitor response times and resource usage
- Consider upgrading to paid plans for higher limits

### Frontend Scaling
- Vercel provides global CDN
- Automatic scaling for traffic spikes
- Consider paid plans for advanced features

## 9. Security Checklist

### Pre-Deployment
- [ ] JWT secret is strong and unique
- [ ] Database credentials are secure
- [ ] CORS is configured for production domain only
- [ ] Environment variables are not committed to Git
- [ ] Dependencies are up to date and secure

### Post-Deployment
- [ ] Test all authentication flows
- [ ] Verify RBAC permissions
- [ ] Check API endpoints are protected
- [ ] Test database connections
- [ ] Verify SSL certificates

## 10. Troubleshooting

### Common Issues

#### Backend Deployment Issues
- **Build fails**: Check package.json scripts and dependencies
- **Port conflicts**: Render assigns PORT automatically
- **Database connection**: Verify connection string format

#### Frontend Deployment Issues
- **Build fails**: Check Vite configuration and dependencies
- **API calls fail**: Verify VITE_API_URL environment variable
- **CORS errors**: Update backend CORS_ORIGIN setting

#### Database Issues
- **Connection timeout**: Check firewall settings
- **Migration fails**: Verify SQL syntax in schema files
- **Seed data fails**: Check foreign key constraints

### Logs and Debugging
1. Check Vercel/Render deployment logs
2. Use browser developer tools for frontend issues
3. Test API endpoints with Postman
4. Monitor database query performance

## 11. Rollback Strategy

### Emergency Rollback
1. **Frontend**: Deploy previous commit in Vercel
2. **Backend**: Roll back to previous deployment in Render
3. **Database**: Restore from backup if schema changes

### Gradual Rollback
1. Deploy to staging environment first
2. Test thoroughly before production deployment
3. Use feature flags for gradual rollouts

## 12. Performance Optimization

### Frontend
- Enable Vercel analytics
- Optimize bundle size
- Implement code splitting
- Use CDN for static assets

### Backend
- Implement caching where appropriate
- Optimize database queries
- Use connection pooling
- Monitor memory usage

### Database
- Create appropriate indexes
- Monitor slow queries
- Optimize table structure
- Use database views for complex queries

## 13. Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth, 100 deployments/month
- **Render**: 750 hours/month, 512MB RAM
- **NeonDB**: 512MB storage, 100 hours compute

### Paid Plans (Approximate)
- **Vercel Pro**: $20/month
- **Render**: $7-25/month depending on resources
- **NeonDB**: $15-50/month depending on storage/compute

## 14. Maintenance Schedule

### Daily
- Monitor application logs
- Check error rates
- Verify database connectivity

### Weekly
- Review performance metrics
- Update dependencies
- Check security vulnerabilities

### Monthly
- Database maintenance
- Security audits
- Performance optimization

## 15. Support and Documentation

### Getting Help
- Vercel: [docs.vercel.com](https://docs.vercel.com)
- Render: [docs.render.com](https://docs.render.com)
- NeonDB: [neon.tech/docs](https://neon.tech/docs)

### Additional Resources
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

---

## Deployment Checklist

- [ ] Database created and seeded
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables configured
- [ ] SSL certificates active
- [ ] Domain configured (optional)
- [ ] Authentication tested
- [ ] All user roles verified
- [ ] API endpoints functional
- [ ] Performance optimized
- [ ] Monitoring enabled
- [ ] Documentation updated

**Deployment Complete!** 🎉
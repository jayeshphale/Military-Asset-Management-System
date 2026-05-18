# Military Asset Management System - RBAC Explanation

## Overview

The Military Asset Management System implements a comprehensive Role-Based Access Control (RBAC) system to ensure secure access to sensitive military equipment data. This document explains the RBAC implementation, user roles, permissions, and access control mechanisms.

## RBAC Architecture

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Roles    │    │   Permissions   │    │   Resources     │
│                 │    │                 │    │                 │
│ • Admin         │    │ • CRUD Ops      │    │ • Users         │
│ • Base Cmdr     │    │ • Read Ops      │    │ • Inventory     │
│ • Logistics     │    │ • Restricted    │    │ • Transactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Security Layers

1. **Authentication Layer**: JWT token validation
2. **Authorization Layer**: Role-based permission checking
3. **Data Layer**: Row-level security and filtering
4. **Audit Layer**: Complete activity logging

## User Roles

### 1. Admin

**Description**: System administrator with full access to all system functions and data.

**Responsibilities**:
- User account management
- System configuration
- Audit log monitoring
- Full operational oversight

**Permissions**:
- ✅ Create, read, update, delete all data
- ✅ Manage user accounts and roles
- ✅ Access all audit logs
- ✅ View system-wide reports
- ✅ Configure system settings

**Base Assignment**: None (global access)

### 2. Base Commander

**Description**: Military officer responsible for operations at a specific base.

**Responsibilities**:
- Oversee base-specific operations
- Approve equipment assignments
- Monitor base inventory and expenditures
- Coordinate with logistics for transfers

**Permissions**:
- ✅ Read dashboard data for assigned base
- ✅ View inventory levels for assigned base
- ✅ Create and manage equipment assignments
- ✅ View expenditure records for assigned base
- ✅ Request transfers (subject to approval)

**Base Assignment**: Required (single base)

### 3. Logistics Officer

**Description**: Logistics specialist responsible for procurement and equipment movement.

**Responsibilities**:
- Manage equipment procurement
- Coordinate inter-base transfers
- Monitor inventory levels across bases
- Process purchase orders

**Permissions**:
- ✅ Read dashboard data (all bases)
- ✅ Create and manage purchases
- ✅ Create and manage transfers
- ✅ View inventory levels (all bases)
- ✅ Monitor transfer status

**Base Assignment**: None (logistics role)

## Permission Matrix

| Feature | Admin | Base Commander | Logistics Officer |
|---------|-------|----------------|-------------------|
| **Dashboard** | ✅ Full | ✅ Assigned Base | ✅ All Bases |
| **User Management** | ✅ CRUD | ❌ | ❌ |
| **Base Management** | ✅ CRUD | ❌ | ❌ |
| **Equipment Types** | ✅ CRUD | ❌ | ❌ |
| **Purchases** | ✅ CRUD | ❌ | ✅ CRUD |
| **Transfers** | ✅ CRUD | 🔄 Request Only | ✅ CRUD |
| **Assignments** | ✅ CRUD | ✅ CRUD (Base) | ❌ |
| **Expenditures** | ✅ CRUD | ✅ CRUD (Base) | ❌ |
| **Inventory** | ✅ CRUD | ✅ Read (Base) | ✅ Read |
| **Audit Logs** | ✅ Read | ❌ | ❌ |

**Legend:**
- ✅ Full access
- 🔄 Limited access
- ❌ No access

## Middleware Implementation

### Authentication Middleware

```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
```

### Authorization Middleware

```javascript
// middleware/auth.js
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
```

### Base-Specific Authorization

```javascript
// middleware/auth.js
const authorizeBaseAccess = (req, res, next) => {
  const userRole = req.user.role;
  const userBaseId = req.user.assigned_base_id;
  const requestedBaseId = req.params.baseId || req.body.base_id;

  // Admin has access to all bases
  if (userRole === 'Admin') {
    return next();
  }

  // Base Commander can only access their assigned base
  if (userRole === 'Base Commander') {
    if (userBaseId !== parseInt(requestedBaseId)) {
      return res.status(403).json({
        message: 'Access denied: Can only access assigned base'
      });
    }
  }

  // Logistics Officer has access to all bases for read operations
  // but may have restrictions on write operations
  next();
};
```

## Frontend Access Control

### Route Protection

```javascript
// src/context/AuthContext.jsx
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
```

### Component-Level Permissions

```javascript
// src/components/Dashboard.jsx
const Dashboard = () => {
  const { user } = useAuth();

  const canViewAllBases = user.role === 'Admin' || user.role === 'Logistics Officer';
  const canManageUsers = user.role === 'Admin';
  const canViewAuditLogs = user.role === 'Admin';

  return (
    <div>
      {canViewAllBases && <SystemWideMetrics />}
      {canManageUsers && <UserManagement />}
      {canViewAuditLogs && <AuditLogs />}
    </div>
  );
};
```

### Sidebar Navigation Control

```javascript
// src/components/Sidebar.jsx
const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['Admin', 'Base Commander', 'Logistics Officer'] },
    { path: '/users', label: 'User Management', roles: ['Admin'] },
    { path: '/purchases', label: 'Purchases', roles: ['Admin', 'Logistics Officer'] },
    { path: '/transfers', label: 'Transfers', roles: ['Admin', 'Logistics Officer'] },
    { path: '/assignments', label: 'Assignments', roles: ['Admin', 'Base Commander'] },
    { path: '/expenditures', label: 'Expenditures', roles: ['Admin', 'Base Commander'] },
    { path: '/inventory', label: 'Inventory', roles: ['Admin', 'Base Commander', 'Logistics Officer'] },
    { path: '/audit-logs', label: 'Audit Logs', roles: ['Admin'] },
  ];

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(user.role)
  );

  return (
    <nav>
      {visibleItems.map(item => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

## API Endpoint Protection

### Route Definitions with RBAC

```javascript
// routes/users.js
router.get('/', authenticateToken, authorizeRoles('Admin'), getUsers);
router.post('/', authenticateToken, authorizeRoles('Admin'), createUser);

// routes/purchases.js
router.get('/', authenticateToken, authorizeRoles('Admin', 'Logistics Officer'), getPurchases);
router.post('/', authenticateToken, authorizeRoles('Admin', 'Logistics Officer'), createPurchase);

// routes/assignments.js
router.get('/', authenticateToken, authorizeRoles('Admin', 'Base Commander'), getAssignments);
router.post('/', authenticateToken, authorizeRoles('Admin', 'Base Commander'), authorizeBaseAccess, createAssignment);
```

## Data Filtering

### Database-Level Filtering

```sql
-- Users can only see data for their assigned base (Base Commander)
SELECT * FROM assignments
WHERE base_id = $1 OR $2 = 'Admin' OR $2 = 'Logistics Officer'

-- Parameters: [user.assigned_base_id, user.role]
```

### API-Level Filtering

```javascript
// controllers/assignments.js
const getAssignments = async (req, res) => {
  const userRole = req.user.role;
  const userBaseId = req.user.assigned_base_id;

  let whereClause = {};

  if (userRole === 'Base Commander') {
    whereClause.base_id = userBaseId;
  }
  // Admin and Logistics Officer can see all

  const assignments = await Assignment.findAll({ where: whereClause });
  res.json({ data: assignments });
};
```

## Audit Logging

### Automatic Audit Trail

```javascript
// middleware/audit.js
const auditLog = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    // Log successful operations
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      await AuditLog.create({
        user_id: req.user.id,
        action: req.method,
        module_name: req.baseUrl.split('/').pop(),
        request_method: req.method,
        endpoint: req.originalUrl,
        payload: req.body,
        ip_address: req.ip,
        timestamp: new Date()
      });
    }

    originalSend.call(this, data);
  };

  next();
};
```

### Audit Log Access Control

- **Admin**: Full access to all audit logs
- **Base Commander**: No access to audit logs
- **Logistics Officer**: No access to audit logs

## Security Best Practices

### Token Security
- JWT tokens expire after 24 hours
- Secure secret key storage
- Token blacklisting capability

### Password Security
- bcrypt hashing with 12 rounds
- Minimum password requirements
- Password change functionality

### Input Validation
- Zod schema validation
- SQL injection prevention
- XSS protection

### Network Security
- HTTPS only in production
- CORS configuration
- Rate limiting

## Testing RBAC

### Unit Tests

```javascript
// tests/auth.test.js
describe('RBAC Authorization', () => {
  test('Admin can access user management', async () => {
    const token = generateToken({ role: 'Admin' });
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test('Base Commander cannot access user management', async () => {
    const token = generateToken({ role: 'Base Commander' });
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
  });
});
```

### Integration Tests

```javascript
// tests/rbac.integration.test.js
describe('RBAC Data Filtering', () => {
  test('Base Commander sees only assigned base data', async () => {
    const token = generateToken({
      role: 'Base Commander',
      assigned_base_id: 1
    });

    const response = await request(app)
      .get('/api/assignments')
      .set('Authorization', `Bearer ${token}`);

    const assignments = response.body.data;
    assignments.forEach(assignment => {
      expect(assignment.base_id).toBe(1);
    });
  });
});
```

## Common RBAC Issues

### Issue 1: Token Expiration
**Problem**: Users lose access after token expires
**Solution**: Implement token refresh mechanism

### Issue 2: Role Changes
**Problem**: Users retain old permissions after role change
**Solution**: Force logout and re-authentication

### Issue 3: Base Reassignment
**Problem**: Base Commanders retain access to old base
**Solution**: Update token payload on reassignment

### Issue 4: Permission Bypass
**Problem**: API endpoints not properly protected
**Solution**: Comprehensive middleware coverage

## Monitoring and Compliance

### Access Monitoring
- Log all authentication attempts
- Track permission violations
- Monitor unusual access patterns

### Compliance Reporting
- Generate access reports
- Audit permission changes
- Track role assignments

### Security Audits
- Regular permission reviews
- Access pattern analysis
- Security vulnerability assessments

## Conclusion

The RBAC system provides comprehensive security for the Military Asset Management System, ensuring that users only access data and functions appropriate to their roles and responsibilities. The implementation includes multiple layers of protection, from authentication to data-level filtering, with complete audit trails for compliance and monitoring.

This approach ensures military data security while maintaining operational efficiency across different user roles and base assignments.
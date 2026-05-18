# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All requests (except login) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@military.com",
  "password": "Admin@123"
}

Response 200:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@military.com",
    "role": "Admin",
    "assigned_base_id": null
  }
}
```

### Users Management

#### Get All Users
```
GET /users
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@military.com",
      "role": "Admin",
      "assigned_base_id": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```
GET /users/:id
Authorization: Bearer <token>

Response 200:
{
  "data": { ...user object }
}
```

#### Create User
```
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@military.com",
  "password": "SecurePassword@123",
  "role": "Base Commander",
  "assigned_base_id": 1
}

Response 201:
{
  "message": "User created successfully",
  "data": { ...user object }
}
```

#### Update User
```
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "Logistics Officer",
  "assigned_base_id": 2
}

Response 200:
{
  "message": "User updated successfully",
  "data": { ...updated user }
}
```

#### Delete User
```
DELETE /users/:id
Authorization: Bearer <token>

Response 200:
{
  "message": "User deleted successfully"
}
```

### Bases

#### Get All Bases
```
GET /bases
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "name": "Alpha Base",
      "location": "Northern Region",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Base
```
POST /bases
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Delta Base",
  "location": "Eastern Region"
}

Response 201:
{
  "message": "Base created successfully",
  "data": { ...base object }
}
```

### Equipment

#### Get All Equipment
```
GET /equipment
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "name": "Rifles",
      "category": "Weapons",
      "unit": "pieces"
    }
  ]
}
```

#### Create Equipment
```
POST /equipment
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Combat Drones",
  "category": "Electronics",
  "unit": "units"
}

Response 201:
{
  "message": "Equipment created successfully",
  "data": { ...equipment object }
}
```

### Purchases

#### Get All Purchases
```
GET /purchases
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "quantity": 100,
      "purchase_date": "2024-01-15",
      "remarks": "New shipment",
      "created_by": 1,
      "created_at": "2024-01-15T00:00:00.000Z",
      "base_name": "Alpha Base",
      "equipment_name": "Rifles"
    }
  ]
}
```

#### Create Purchase
```
POST /purchases
Authorization: Bearer <token>
Content-Type: application/json

{
  "base_id": 1,
  "equipment_type_id": 2,
  "quantity": 500,
  "purchase_date": "2024-01-20",
  "remarks": "Ammunition replenishment"
}

Response 201:
{
  "message": "Purchase created successfully",
  "data": { ...purchase object }
}
```

### Transfers

#### Get All Transfers
```
GET /transfers
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "from_base_id": 1,
      "to_base_id": 2,
      "equipment_type_id": 1,
      "quantity": 50,
      "transfer_date": "2024-01-20",
      "status": "Completed",
      "remarks": "Standard reallocation",
      "from_base_name": "Alpha Base",
      "to_base_name": "Bravo Base",
      "equipment_name": "Rifles"
    }
  ]
}
```

#### Create Transfer
```
POST /transfers
Authorization: Bearer <token>
Content-Type: application/json

{
  "from_base_id": 1,
  "to_base_id": 2,
  "equipment_type_id": 1,
  "quantity": 30,
  "transfer_date": "2024-01-21",
  "remarks": "Contingency transfer"
}

Response 201:
{
  "message": "Transfer created successfully",
  "data": { ...transfer object }
}
```

#### Update Transfer Status
```
PUT /transfers/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed"
}

Response 200:
{
  "message": "Transfer status updated successfully",
  "data": { ...updated transfer }
}
```

Valid statuses: `Pending`, `Accepted`, `Rejected`, `Completed`

### Assignments

#### Get All Assignments
```
GET /assignments
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "assigned_to": "Soldier John",
      "quantity": 2,
      "assignment_date": "2024-01-15",
      "created_by": 1,
      "base_name": "Alpha Base",
      "equipment_name": "Rifles"
    }
  ]
}
```

#### Create Assignment
```
POST /assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "base_id": 1,
  "equipment_type_id": 4,
  "assigned_to": "Medic Sarah",
  "quantity": 5,
  "assignment_date": "2024-01-22"
}

Response 201:
{
  "message": "Assignment created successfully",
  "data": { ...assignment object }
}
```

### Expenditures

#### Get All Expenditures
```
GET /expenditures
Authorization: Bearer <token>

Response 200:
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 2,
      "quantity": 100,
      "reason": "Field Operations",
      "expenditure_date": "2024-01-20",
      "created_by": 1,
      "base_name": "Alpha Base",
      "equipment_name": "Ammunition"
    }
  ]
}
```

#### Create Expenditure
```
POST /expenditures
Authorization: Bearer <token>
Content-Type: application/json

{
  "base_id": 1,
  "equipment_type_id": 1,
  "quantity": 3,
  "reason": "Damaged",
  "expenditure_date": "2024-01-21"
}

Response 201:
{
  "message": "Expenditure created successfully",
  "data": { ...expenditure object }
}
```

### Dashboard

#### Get Dashboard Summary
```
GET /dashboard/summary
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "opening_balance": 1500,
    "current_balance": 2100,
    "net_movement": 600,
    "assigned": 150,
    "expended": 250,
    "closing_balance": 1700,
    "recent_transactions": [...]
  }
}
```

#### Get Net Movement Details
```
GET /dashboard/net-movement?baseId=1
Authorization: Bearer <token>

Response 200:
{
  "data": {
    "purchases_in": [...],
    "transfers_in": [...],
    "transfers_out": [...]
  }
}
```

### Audit Logs

#### Get All Audit Logs
```
GET /audit-logs?page=1&limit=50
Authorization: Bearer <token> (Admin only)

Response 200:
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "POST",
      "module_name": "purchases",
      "request_method": "POST",
      "endpoint": "/api/purchases",
      "payload": { ...data },
      "ip_address": "127.0.0.1",
      "timestamp": "2024-01-20T00:00:00.000Z",
      "user_name": "Admin User"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

#### Get Audit Logs by Date Range
```
GET /audit-logs/range?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token> (Admin only)

Response 200:
{
  "data": [...]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "path": ["quantity"],
      "message": "Quantity must be positive"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Required role: Admin"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

No rate limiting implemented in this version. Recommended for production deployment.

## Pagination

Use `page` and `limit` parameters for paginated endpoints:

```
GET /audit-logs?page=2&limit=25
```

## Sorting

Most list endpoints support sorting via database queries. Implement on specific endpoints as needed.

## Filtering

Filter parameters vary by endpoint. Check specific endpoint documentation for available filters.

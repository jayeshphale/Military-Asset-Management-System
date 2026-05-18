# Military Asset Management System - API Documentation

## Overview

This document provides comprehensive API documentation for the Military Asset Management System. All endpoints require JWT authentication except for login.

## Base URL
```
http://localhost:5000/api
```

## Authentication

### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@military.com",
    "role": "Admin",
    "assigned_base_id": null
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `400`: Validation error

---

## Dashboard API

### GET /dashboard/summary

Get dashboard summary with key metrics.

**Authorization:** All authenticated users

**Response (200):**
```json
{
  "data": {
    "opening_balance": 1458,
    "current_balance": 1458,
    "net_movement": 337,
    "assigned": 53,
    "expended": 21,
    "closing_balance": 1721,
    "recent_transactions": [
      {
        "type": "expenditure",
        "base_id": 3,
        "equipment_type_id": 2,
        "quantity": 1,
        "created_at": "2026-05-14T09:32:09.191Z"
      }
    ]
  }
}
```

---

## User Management API

### GET /users

Get all users (Admin only).

**Authorization:** Admin only

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@military.com",
      "role": "Admin",
      "assigned_base_id": null,
      "created_at": "2026-05-14T08:00:00.000Z"
    }
  ]
}
```

### POST /users

Create new user (Admin only).

**Authorization:** Admin only

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "Admin|Base Commander|Logistics Officer",
  "assigned_base_id": "number|null"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "New User",
    "email": "new@example.com",
    "role": "Base Commander",
    "assigned_base_id": 1
  }
}
```

---

## Base Management API

### GET /bases

Get all military bases.

**Authorization:** All authenticated users

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Alpha Base",
      "location": "Northern Region",
      "created_at": "2026-05-14T08:00:00.000Z"
    }
  ]
}
```

### POST /bases

Create new base (Admin only).

**Authorization:** Admin only

**Request Body:**
```json
{
  "name": "string",
  "location": "string"
}
```

---

## Equipment Management API

### GET /equipment

Get all equipment types.

**Authorization:** All authenticated users

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Rifles",
      "category": "Weapons",
      "unit": "pieces",
      "created_at": "2026-05-14T08:00:00.000Z"
    }
  ]
}
```

### POST /equipment

Create new equipment type (Admin only).

**Authorization:** Admin only

**Request Body:**
```json
{
  "name": "string",
  "category": "string",
  "unit": "string"
}
```

---

## Purchase Management API

### GET /purchases

Get all purchases.

**Authorization:** Admin, Logistics Officer

**Query Parameters:**
- `base_id`: Filter by base
- `start_date`: Filter by date range
- `end_date`: Filter by date range

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "quantity": 25,
      "purchase_date": "2026-04-15T00:00:00.000Z",
      "remarks": "Monthly rifle procurement",
      "created_by": 1,
      "base": {
        "id": 1,
        "name": "Alpha Base"
      },
      "equipment_type": {
        "id": 1,
        "name": "Rifles"
      },
      "created_by_user": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ]
}
```

### POST /purchases

Create new purchase.

**Authorization:** Admin, Logistics Officer

**Request Body:**
```json
{
  "base_id": "number",
  "equipment_type_id": "number",
  "quantity": "number",
  "purchase_date": "YYYY-MM-DD",
  "remarks": "string (optional)"
}
```

---

## Transfer Management API

### GET /transfers

Get all transfers.

**Authorization:** Admin, Logistics Officer

**Query Parameters:**
- `status`: Filter by status (Pending, Accepted, Rejected, Completed)
- `base_id`: Filter by base

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "from_base_id": 1,
      "to_base_id": 2,
      "equipment_type_id": 1,
      "quantity": 10,
      "transfer_date": "2026-04-20T00:00:00.000Z",
      "status": "Completed",
      "remarks": "Reinforcement support",
      "created_by": 3,
      "from_base": {
        "id": 1,
        "name": "Alpha Base"
      },
      "to_base": {
        "id": 2,
        "name": "Bravo Base"
      },
      "equipment_type": {
        "id": 1,
        "name": "Rifles"
      }
    }
  ]
}
```

### POST /transfers

Create new transfer request.

**Authorization:** Admin, Logistics Officer

**Request Body:**
```json
{
  "from_base_id": "number",
  "to_base_id": "number",
  "equipment_type_id": "number",
  "quantity": "number",
  "transfer_date": "YYYY-MM-DD",
  "remarks": "string (optional)"
}
```

---

## Assignment Management API

### GET /assignments

Get all assignments.

**Authorization:** Admin, Base Commander

**Query Parameters:**
- `base_id`: Filter by base

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "assigned_to": "Soldier Alpha-1",
      "quantity": 5,
      "assignment_date": "2026-04-15T00:00:00.000Z",
      "created_by": 2,
      "base": {
        "id": 1,
        "name": "Alpha Base"
      },
      "equipment_type": {
        "id": 1,
        "name": "Rifles"
      }
    }
  ]
}
```

### POST /assignments

Create new assignment.

**Authorization:** Admin, Base Commander

**Request Body:**
```json
{
  "base_id": "number",
  "equipment_type_id": "number",
  "assigned_to": "string",
  "quantity": "number",
  "assignment_date": "YYYY-MM-DD"
}
```

---

## Expenditure Management API

### GET /expenditures

Get all expenditures.

**Authorization:** Admin, Base Commander

**Query Parameters:**
- `base_id`: Filter by base

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "quantity": 2,
      "reason": "Training",
      "expenditure_date": "2026-04-10T00:00:00.000Z",
      "created_by": 2,
      "base": {
        "id": 1,
        "name": "Alpha Base"
      },
      "equipment_type": {
        "id": 1,
        "name": "Rifles"
      }
    }
  ]
}
```

### POST /expenditures

Create new expenditure.

**Authorization:** Admin, Base Commander

**Request Body:**
```json
{
  "base_id": "number",
  "equipment_type_id": "number",
  "quantity": "number",
  "reason": "string",
  "expenditure_date": "YYYY-MM-DD"
}
```

---

## Inventory Management API

### GET /inventory

Get inventory by base.

**Authorization:** All authenticated users

**Query Parameters:**
- `base_id`: Filter by specific base

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "base_id": 1,
      "equipment_type_id": 1,
      "opening_balance": 75,
      "current_balance": 75,
      "base": {
        "id": 1,
        "name": "Alpha Base"
      },
      "equipment_type": {
        "id": 1,
        "name": "Rifles",
        "unit": "pieces"
      }
    }
  ]
}
```

---

## Audit Logs API

### GET /audit-logs

Get audit logs (Admin only).

**Authorization:** Admin only

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "LOGIN",
      "module_name": "auth",
      "request_method": "POST",
      "endpoint": "/api/auth/login",
      "payload": {
        "email": "admin@military.com"
      },
      "ip_address": "192.168.1.100",
      "timestamp": "2026-05-14T08:00:00.000Z",
      "user": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "message": "Access token is required"
}
```

**403 Forbidden:**
```json
{
  "message": "Insufficient permissions"
}
```

**400 Bad Request:**
```json
{
  "message": "Validation error",
  "errors": ["Field is required", "Invalid format"]
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

- API requests are rate limited to prevent abuse
- Standard limit: 100 requests per 15 minutes per IP
- Auth endpoints: 10 requests per 15 minutes per IP

---

## Data Validation

All POST/PUT endpoints validate input data using Zod schemas:

- **Required fields** are enforced
- **Data types** are validated
- **Foreign key constraints** are checked
- **Business rules** are enforced (e.g., quantity > 0)

---

## Authentication Headers

Include the JWT token in the Authorization header for all protected endpoints:

```
Authorization: Bearer <jwt_token>
```

---

## Content Types

- **Request**: `application/json`
- **Response**: `application/json`

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## Sorting & Filtering

Most list endpoints support sorting and filtering:

**Query Parameters:**
- `sort_by`: Field to sort by
- `sort_order`: 'asc' or 'desc'
- `filter[field]`: Filter by specific field

Example: `GET /api/purchases?sort_by=created_at&sort_order=desc&filter[base_id]=1`
 the # ONYX API Documentation

## Overview
The ONYX API is a RESTful backend that manages buildings, assessments, users, and related data. All endpoints require authentication, and some require admin authorization.

---

## Authentication
Most endpoints require a valid JWT token. Include it in the `Authorization` header as `Bearer <token>`.

### Auth Endpoints
| Method | Endpoint         | Description         | Body Params |
|--------|------------------|--------------------|-------------|
| POST   | /auth/register   | Register a user    | `{ email, password, role }` |
| POST   | /auth/login      | Login a user       | `{ email, password }` |


**Registration example (POST /auth/register):**
```json
{
  "email": "testuser@example.com",
  "password": "TestPassword123!",
  "role": "admin"
}
```
---

## User Endpoints
| Method | Endpoint         | Description         | Access      |
|--------|------------------|--------------------|-------------|
| GET    | /users/me         | Get current user   | Authenticated |
| GET    | /users/           | List all users     | Admin only |
| GET    | /users/:id        | Get user by ID     | Admin only |
| DELETE | /users/:id        | Delete user by ID  | Admin only |


---

## Building Type CSV Upload

**POST /building-types/upload**

- Upload a CSV file to bulk insert building types.
- Requires authentication (Bearer token).
- CSV columns: `building_type`, `category`, `subcategory`

**Sample CSV:**
```csv
building_type,category,subcategory
Office,Commercial,High-rise
Apartment,Residential,Multi-family
```

**Sample curl:**
```bash
curl -X POST http://localhost:3000/building-types/upload \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "file=@building_types.csv"
```

|--------|------------------|--------------------|-------------|
| GET    | /user/me         | Get current user   | Authenticated |
| GET    | /user/           | List all users     | Admin only |
| GET    | /user/:id        | Get user by ID     | Admin only |
| DELETE | /user/:id        | Delete user by ID  | Admin only |

---

## Building Endpoints
| Method | Endpoint         | Description                | Access      |
|--------|------------------|---------------------------|-------------|
| POST   | /buildings/       | Create building (all fields required, see below) | Admin only |
| GET    | /buildings/       | List all buildings        | Authenticated |
| GET    | /buildings/:id    | Get building by ID        | Authenticated |
| PATCH  | /buildings/:id    | Update building           | Admin only |
| DELETE | /buildings/:id    | Delete building           | Admin only |


### Create Building (POST /buildings/)

**Required fields:**
- name
- type
- city
- state
- zip_code
- address
- year_built
- cost_per_sqft
- square_footage
- description
- image_url

**Request Example:**
```json
{
  "name": "Empire State Building",
  "type": "Commercial",
  "city": "New York",
  "state": "NY",
  "zip_code": "10118",
  "address": "20 W 34th St",
  "year_built": 1931,
  "cost_per_sqft": 500.00,
  "square_footage": 208879,
  "description": "Iconic skyscraper",
  "image_url": "http://example.com/image.jpg"
}
```

**Success Response:**
- HTTP 201 Created
```json
{
  "id": "<building-uuid>"
}
```

**Error Response (missing fields):**
- HTTP 400 Bad Request
```json
{
  "error": "Missing required fields",
  "missing_fields": ["city", "address", "year_built"]
}
```

---

## Building Type Endpoints
| Method | Endpoint                 | Description              | Access      |
|--------|--------------------------|--------------------------|-------------|
| GET    | /building-types/           | List all building types  | Authenticated |
| GET    | /building-types/:type      | Get building type by type | Authenticated |

---

## Audit Log Endpoints
| Method | Endpoint         | Description         | Access      |
|--------|------------------|--------------------|-------------|
| GET    | /audit-logs/       | List all audit logs| Admin only |
| GET    | /audit-logs/:id    | Get audit log by ID| Admin only |

---

## Field Assessment Endpoints
| Method | Endpoint                               | Description                              | Access      |
|--------|----------------------------------------|------------------------------------------|-------------|
| POST   | /field-assessments/                      | Create field assessment                  | Authenticated |
| GET    | /field-assessments/                      | List all field assessments               | Authenticated |
| GET    | /field-assessments/:id                   | Get field assessment by ID               | Authenticated |
| GET    | /field-assessments/building/:building_id | Get field assessments for a building     | Authenticated |
| POST   | /field-assessments/:id/items             | Add items to a field assessment          | Authenticated |
| GET    | /field-assessments/:id/items             | Get items for a field assessment         | Authenticated |
| PATCH  | /field-assessments/:id/items/costs       | Update repair costs for assessment items | Authenticated |

---

## Pre-Assessment Endpoints
| Method | Endpoint                                 | Description                                | Access      |
|--------|------------------------------------------|--------------------------------------------|-------------|
| POST   | /preAssessment/                          | Create pre-assessment                      | Authenticated |
| GET    | /preAssessment/                          | List all pre-assessments                   | Authenticated |
| GET    | /preAssessment/:id                       | Get pre-assessment by ID                   | Authenticated |
| GET    | /preAssessment/building/:building_id     | Get pre-assessments for a building         | Authenticated |
| POST   | /preAssessment/:id/items                 | Add items to a pre-assessment              | Authenticated |
| GET    | /preAssessment/:id/items                 | Get items for a pre-assessment             | Authenticated |

---

## Error Handling
- All endpoints return standard HTTP status codes.
- Validation errors return 400 with details.
- Unauthorized/forbidden access returns 401/403.

## Notes
- All endpoints expect and return JSON.
- For detailed request/response schemas, see the controller and validator files.

---

*This documentation provides a standard overview of the ONYX API routes, methods, and access requirements. For more details, refer to the codebase or request specific endpoint examples.*

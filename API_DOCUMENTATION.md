# ONYX API Documentation

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
| GET    | /user/me         | Get current user   | Authenticated |
| GET    | /user/           | List all users     | Admin only |
| GET    | /user/:id        | Get user by ID     | Admin only |
| DELETE | /user/:id        | Delete user by ID  | Admin only |

---

## Building Endpoints
| Method | Endpoint         | Description                | Access      |
|--------|------------------|---------------------------|-------------|
| POST   | /building/       | Create building           | Admin only |
| GET    | /building/       | List all buildings        | Authenticated |
| GET    | /building/:id    | Get building by ID        | Authenticated |
| PATCH  | /building/:id    | Update building           | Admin only |
| DELETE | /building/:id    | Delete building           | Admin only |

---

## Building Type Endpoints
| Method | Endpoint                 | Description              | Access      |
|--------|--------------------------|--------------------------|-------------|
| GET    | /buildingType/           | List all building types  | Authenticated |
| GET    | /buildingType/:type      | Get building type by key | Authenticated |

---

## Audit Log Endpoints
| Method | Endpoint         | Description         | Access      |
|--------|------------------|--------------------|-------------|
| GET    | /auditLog/       | List all audit logs| Admin only |
| GET    | /auditLog/:id    | Get audit log by ID| Admin only |

---

## Field Assessment Endpoints
| Method | Endpoint                               | Description                              | Access      |
|--------|----------------------------------------|------------------------------------------|-------------|
| POST   | /fieldAssessment/                      | Create field assessment                  | Authenticated |
| GET    | /fieldAssessment/                      | List all field assessments               | Authenticated |
| GET    | /fieldAssessment/:id                   | Get field assessment by ID               | Authenticated |
| GET    | /fieldAssessment/building/:building_id | Get field assessments for a building     | Authenticated |
| POST   | /fieldAssessment/:id/items             | Add items to a field assessment          | Authenticated |
| GET    | /fieldAssessment/:id/items             | Get items for a field assessment         | Authenticated |
| PATCH  | /fieldAssessment/:id/items/costs       | Update repair costs for assessment items | Authenticated |

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

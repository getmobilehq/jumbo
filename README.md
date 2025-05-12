# ONYX API

## Overview
ONYX API is a scalable backend API designed for managing buildings and assessments. It is built with Node.js and Express, providing endpoints for various building-related operations, user authentication, and data management.

## Features
- RESTful API endpoints for building and assessment management
- User authentication and authorization using JWT
- Input validation using Joi
- Security best practices with Helmet and CORS
- Logging with Morgan
- Password hashing with Bcrypt
- MySQL database integration

## Project Structure
```
/onyx.js                # Main application logic or entry point
/routes/                # API route handlers (e.g., auditLog.js, buildingType.js)
/app.js                 # Main Express app (entry point specified in package.json)
/.env                   # Environment variables
/package.json           # Project metadata and dependencies
/render.yaml            # Render deployment configuration
```

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (database, JWT secret, etc.)
3. **Run the server:**
   ```bash
   npm start
   ```

## API Endpoints
API endpoints are defined in the `/routes` directory. Example routes include:
- `/auditLog` - Audit log operations
- `/buildingType` - Building type management

Refer to the individual files in the `routes/` directory for more details on each endpoint.

## Dependencies
- express
- mysql2
- dotenv
- bcrypt
- cors
- helmet
- joi
- jsonwebtoken
- morgan
- uuid

## Deployment
Deployment configuration can be found in `render.yaml` for Render.com or similar platforms.

## License
[MIT](LICENSE)

---
*For more details, see the code and route files. Contributions and issues are welcome!*

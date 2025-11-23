# CLAUDE.md - AI Assistant Guide

This document provides context for AI assistants working with this codebase.

## Project Overview

**Project**: REST API - User Management Service
**Type**: Express.js REST API with Node.js
**Purpose**: Production-ready REST API with full CRUD operations for user management, featuring security middleware, input validation, rate limiting, and comprehensive error handling.

## Quick Commands

```bash
# Install dependencies
npm install

# Development (with hot-reload)
npm run dev

# Production
npm start

# Run tests
npm test
```

## Project Structure

```
/
├── server.js              # Main entry point - Express setup, middleware stack
├── controllers/
│   └── userController.js  # Business logic - CRUD operation handlers
├── models/
│   └── User.js            # Data model - In-memory storage with static methods
├── routes/
│   └── users.js           # Route definitions - Endpoints and validation rules
├── middleware/
│   └── errorMiddleware.js # Error handling - 404 and error processors
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (PORT, NODE_ENV)
└── README.md              # User-facing documentation
```

## Architecture Pattern: MVC

### Models (`/models`)
- Static class methods for data operations
- In-memory storage (array-based, no persistence)
- Methods: `getAll()`, `getById()`, `getByEmail()`, `create()`, `update()`, `delete()`, `count()`, `clear()`

### Controllers (`/controllers`)
- Async functions with try-catch error handling
- Input validation via `validationResult()` from express-validator
- Errors delegated to middleware via `next(error)`
- Consistent JSON response format with `success` boolean

### Routes (`/routes`)
- Express Router with middleware chaining
- Validation rules defined inline with routes
- Pattern: `router.method(path, [...validators], controller)`

### Middleware (`/middleware`)
- `notFound`: 404 handler for undefined routes
- `errorHandler`: Centralized error processing

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info and available endpoints |
| GET | `/health` | Health check (status, uptime, timestamp) |
| GET | `/api/users` | List users (pagination, search) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Query Parameters (GET /api/users)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Filter by name or email

## Response Format Convention

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### HTTP Status Codes
- `200`: Success (GET, PUT, DELETE)
- `201`: Created (POST)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Validation Rules

**User creation/update** (`/routes/users.js`):
- `name`: Required, non-empty string, trimmed
- `email`: Required, valid email format, normalized, unique
- `age`: Optional, positive integer (min: 0, max: 150)

## Code Conventions

### Async/Await Pattern
All controllers use async functions:
```javascript
const createUser = async (req, res, next) => {
  try {
    // logic
  } catch (error) {
    next(error);
  }
};
```

### Validation First
Input validated before any processing:
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ success: false, ... });
}
```

### Timestamps
ISO 8601 format for all dates (`createdAt`, `updatedAt`)

### Error Handling
- Never expose stack traces in production
- All errors include `success: false`
- Use appropriate HTTP status codes

## Dependencies

### Production
- `express@^4.18.2` - Web framework
- `cors@^2.8.5` - CORS middleware
- `helmet@^7.1.0` - Security headers
- `morgan@^1.10.0` - Request logging
- `express-rate-limit@^7.1.5` - Rate limiting (100 req/15min/IP)
- `express-validator@^7.0.1` - Input validation
- `dotenv@^16.3.1` - Environment variables

### Development
- `nodemon@^3.0.2` - Hot-reload server
- `jest@^29.7.0` - Testing framework
- `supertest@^6.3.3` - HTTP testing

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |

## Testing

Testing infrastructure is set up (Jest + Supertest) but no tests are currently implemented.

### Test Pattern Example
```javascript
const request = require('supertest');
const app = require('../server');

describe('GET /api/users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

## Security Features

1. **Helmet**: Security headers (XSS, clickjacking protection)
2. **CORS**: Enabled for cross-origin requests
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: All user inputs validated and sanitized
5. **Error Masking**: Stack traces hidden in production

## Data Storage

**Current**: In-memory storage (JavaScript array)
- Data is lost on server restart
- Suitable for development/testing only
- See `/models/User.js` for implementation

**Sample data included**: 3 pre-seeded users (John, Jane, Bob)

## Important Notes for AI Assistants

1. **No Database**: This project uses in-memory storage. Database integration would require significant changes to `/models/User.js`.

2. **Validation Location**: Validation rules are in `/routes/users.js`, not in controllers.

3. **Error Handling**: Always use `next(error)` in controllers, not direct error responses for unexpected errors.

4. **Response Consistency**: All responses must include `success: true/false`.

5. **ID Auto-increment**: User IDs are auto-incremented via `nextId` variable in User model.

6. **Email Uniqueness**: Enforced in model layer for both create and update operations.

7. **No Authentication**: This API has no auth. All endpoints are publicly accessible.

8. **Middleware Order**: Helmet > CORS > Rate Limiter > Morgan > Body Parser > Routes > Error Handlers

## Common Tasks

### Adding a New Field to User
1. Update validation rules in `/routes/users.js`
2. Update `create()` and `update()` methods in `/models/User.js`
3. Update sample data if needed

### Adding a New Endpoint
1. Create controller function in `/controllers/userController.js`
2. Define route and validation in `/routes/users.js`
3. Export and import as needed

### Adding New Route Group
1. Create new controller file in `/controllers/`
2. Create new route file in `/routes/`
3. Mount routes in `/server.js`

## File Reference

| File | Lines | Purpose |
|------|-------|---------|
| `server.js` | ~65 | Express setup, middleware configuration |
| `controllers/userController.js` | ~154 | User CRUD business logic |
| `models/User.js` | ~93 | User model, in-memory storage |
| `routes/users.js` | ~33 | Route definitions, validation |
| `middleware/errorMiddleware.js` | ~42 | Error handling middleware |

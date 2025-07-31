# REST API

A modern REST API built with Express.js featuring user management with full CRUD operations.

## Features

- ✅ RESTful API endpoints
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security middleware (CORS, Helmet)
- ✅ Request logging
- ✅ Pagination and search
- ✅ Health check endpoint

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Access the API:**
   - Base URL: `http://localhost:3000`
   - Health check: `http://localhost:3000/health`

## API Endpoints

### Base Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | API information and available endpoints |
| GET    | `/health` | Health check endpoint |

### User Management

| Method | Endpoint       | Description           | Body Required |
|--------|----------------|-----------------------|---------------|
| GET    | `/api/users`   | Get all users         | No            |
| GET    | `/api/users/:id` | Get user by ID      | No            |
| POST   | `/api/users`   | Create new user       | Yes           |
| PUT    | `/api/users/:id` | Update user         | Yes           |
| DELETE | `/api/users/:id` | Delete user         | No            |

## Request Examples

### Get All Users
```bash
curl -X GET http://localhost:3000/api/users
```

Query parameters:
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of items per page (default: 10)
- `search` (string): Search users by name or email

Example with pagination and search:
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=5&search=john"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/users/1
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Cooper",
    "email": "alice@example.com",
    "age": 28
  }'
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "age": 29
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "User created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "User not found",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## Validation Rules

### User Creation/Update
- `name`: Required string, cannot be empty
- `email`: Required valid email format, must be unique
- `age`: Optional positive integer

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── routes/
│   └── users.js          # User routes
├── controllers/
│   └── userController.js # User business logic
├── models/
│   └── User.js           # User data model
└── middleware/
    └── errorMiddleware.js # Error handling middleware
```

## Security Features

- **Rate Limiting**: Maximum 100 requests per 15 minutes per IP
- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers for protection against common vulnerabilities
- **Input Validation**: Request validation using express-validator
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

## Testing

Run tests with:
```bash
npm test
```

## Development

For development with auto-reload:
```bash
npm run dev
```

## Built With

- [Express.js](https://expressjs.com/) - Web framework
- [Helmet](https://helmetjs.github.io/) - Security middleware
- [CORS](https://github.com/expressjs/cors) - Cross-origin resource sharing
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting
- [Express Validator](https://express-validator.github.io/) - Input validation
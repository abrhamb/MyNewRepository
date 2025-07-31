# E-Marketing Platform

A comprehensive digital marketing platform built with Express.js featuring email campaign management, customer segmentation, analytics, and automation tools.

## Features

### 📧 Email Marketing
- ✅ Campaign creation and management
- ✅ Email template system with variables
- ✅ Campaign scheduling and automation
- ✅ Real-time campaign analytics
- ✅ A/B testing capabilities

### 👥 Customer Segmentation
- ✅ Dynamic customer segments
- ✅ Advanced filtering criteria
- ✅ Segment performance tracking
- ✅ Automated customer updates
- ✅ Custom segment building

### 📊 Analytics & Reporting
- ✅ Real-time dashboard
- ✅ Campaign performance metrics
- ✅ Revenue tracking
- ✅ Engagement analytics
- ✅ Export capabilities

### 🛠 Technical Features
- ✅ RESTful API endpoints
- ✅ Modern web dashboard
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security middleware (CORS, Helmet)
- ✅ Request logging
- ✅ Pagination and search

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

3. **Access the platform:**
   - Dashboard: `http://localhost:3000/index.html`
   - API Base URL: `http://localhost:3000`
   - Health check: `http://localhost:3000/health`

## API Endpoints

### Base Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | API information and available endpoints |
| GET    | `/health` | Health check endpoint |

### Campaign Management

| Method | Endpoint | Description | Body Required |
|--------|----------|-------------|---------------|
| GET    | `/api/campaigns` | Get all campaigns | No |
| GET    | `/api/campaigns/:id` | Get campaign by ID | No |
| POST   | `/api/campaigns` | Create new campaign | Yes |
| PUT    | `/api/campaigns/:id` | Update campaign | Yes |
| DELETE | `/api/campaigns/:id` | Delete campaign | No |
| POST   | `/api/campaigns/:id/send` | Send campaign | No |
| GET    | `/api/campaigns/:id/preview` | Preview campaign | No |

### Email Templates

| Method | Endpoint | Description | Body Required |
|--------|----------|-------------|---------------|
| GET    | `/api/templates` | Get all templates | No |
| GET    | `/api/templates/:id` | Get template by ID | No |
| POST   | `/api/templates` | Create new template | Yes |
| PUT    | `/api/templates/:id` | Update template | Yes |
| DELETE | `/api/templates/:id` | Delete template | No |
| POST   | `/api/templates/:id/render` | Render template with variables | Yes |

### Customer Segments

| Method | Endpoint | Description | Body Required |
|--------|----------|-------------|---------------|
| GET    | `/api/segments` | Get all segments | No |
| GET    | `/api/segments/:id` | Get segment by ID | No |
| POST   | `/api/segments` | Create new segment | Yes |
| PUT    | `/api/segments/:id` | Update segment | Yes |
| DELETE | `/api/segments/:id` | Delete segment | No |
| GET    | `/api/segments/:id/customers` | Get segment customers | No |

### Analytics

| Method | Endpoint | Description | Body Required |
|--------|----------|-------------|---------------|
| GET    | `/api/analytics/dashboard` | Get dashboard stats | No |
| GET    | `/api/analytics/campaigns` | Get campaign analytics | No |
| GET    | `/api/analytics/segments` | Get segment analytics | No |
| GET    | `/api/analytics/revenue` | Get revenue analytics | No |
| GET    | `/api/analytics/engagement` | Get engagement trends | No |

### User Management

| Method | Endpoint       | Description           | Body Required |
|--------|----------------|-----------------------|---------------|
| GET    | `/api/users`   | Get all users         | No            |
| GET    | `/api/users/:id` | Get user by ID      | No            |
| POST   | `/api/users`   | Create new user       | Yes           |
| PUT    | `/api/users/:id` | Update user         | Yes           |
| DELETE | `/api/users/:id` | Delete user         | No            |

## Dashboard

The platform includes a modern web dashboard accessible at `http://localhost:3000/index.html` with:

- **Overview Dashboard**: Real-time statistics and performance charts
- **Campaign Management**: Create, edit, and send email campaigns
- **Template Library**: Manage reusable email templates
- **Customer Segments**: Build and manage customer segments
- **Analytics**: Detailed performance analytics and reporting

## Request Examples

### Create Email Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Campaign",
    "subject": "Welcome to our platform!",
    "templateId": 1,
    "segmentId": 1,
    "type": "email"
  }'
```

### Send Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns/1/send
```

### Get Campaign Analytics
```bash
curl -X GET "http://localhost:3000/api/analytics/campaigns?period=30days"
```

### Create Email Template
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Newsletter Template",
    "subject": "Weekly Newsletter - {{week}}",
    "category": "newsletter",
    "html": "<h1>Hello {{name}}!</h1><p>{{content}}</p>",
    "variables": ["name", "week", "content"]
  }'
```

### Create Customer Segment
```bash
curl -X POST http://localhost:3000/api/segments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Value Customers",
    "description": "Customers with orders > $500",
    "criteria": {
      "totalOrders": {"operator": "greater_than", "value": 500}
    }
  }'
```

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

### Backend
- [Express.js](https://expressjs.com/) - Web framework
- [Helmet](https://helmetjs.github.io/) - Security middleware
- [CORS](https://github.com/expressjs/cors) - Cross-origin resource sharing
- [Morgan](https://github.com/expressjs/morgan) - HTTP request logger
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting
- [Express Validator](https://express-validator.github.io/) - Input validation
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Handlebars](https://handlebarsjs.com/) - Template engine
- [Node-cron](https://github.com/node-cron/node-cron) - Task scheduling

### Frontend
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [Font Awesome](https://fontawesome.com/) - Icons
- Vanilla JavaScript - Dashboard functionality
- CSS Grid & Flexbox - Responsive layout

## Architecture

```
├── Backend API (Express.js)
│   ├── Campaign Management
│   ├── Email Templates
│   ├── Customer Segmentation
│   ├── Analytics & Reporting
│   └── User Management
│
├── Frontend Dashboard
│   ├── Real-time Analytics
│   ├── Campaign Builder
│   ├── Template Editor
│   └── Segment Manager
│
└── Data Models (In-Memory)
    ├── Campaigns
    ├── Templates
    ├── Segments
    └── Users
```

## Upcoming Features

- 🔄 Email automation workflows
- 📧 SMTP integration
- 📊 Advanced A/B testing
- 🔗 CRM integrations
- 📱 Mobile app
- 🎯 Behavioral targeting
- 📈 Conversion tracking
- 🔐 Team collaboration
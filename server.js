const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const userRoutes = require('./routes/users');
const campaignRoutes = require('./routes/campaigns');
const templateRoutes = require('./routes/templates');
const segmentRoutes = require('./routes/segments');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the E-Marketing Platform API',
    version: '1.0.0',
    features: [
      'Email Campaign Management',
      'Customer Segmentation',
      'Email Templates',
      'Analytics & Reporting',
      'User Management'
    ],
          endpoints: {
        campaigns: '/api/campaigns',
        templates: '/api/templates',
        segments: '/api/segments',
        analytics: '/api/analytics',
        users: '/api/users',
        health: '/health'
      }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 E-Marketing Platform running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}`);
  console.log(`📧 Campaign Management: http://localhost:${PORT}/api/campaigns`);
  console.log(`📋 Email Templates: http://localhost:${PORT}/api/templates`);
  console.log(`👥 Customer Segments: http://localhost:${PORT}/api/segments`);
  console.log(`📊 Analytics & Reports: http://localhost:${PORT}/api/analytics`);
});

module.exports = app;
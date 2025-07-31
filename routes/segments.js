const express = require('express');
const { body } = require('express-validator');
const {
  getSegments,
  getSegmentById,
  createSegment,
  updateSegment,
  deleteSegment,
  refreshCustomerCounts,
  getSegmentPerformance,
  getCustomersPreview,
  getAvailableOperators,
  getAvailableFields
} = require('../controllers/segmentController');

const router = express.Router();

// Validation middleware
const validateSegment = [
  body('name').notEmpty().withMessage('Segment name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('criteria').isObject().withMessage('Criteria must be an object')
];

const validateSegmentUpdate = [
  body('name').optional().notEmpty().withMessage('Segment name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('criteria').optional().isObject().withMessage('Criteria must be an object')
];

// Routes
router.get('/operators', getAvailableOperators);
router.get('/fields', getAvailableFields);
router.post('/refresh-counts', refreshCustomerCounts);
router.get('/', getSegments);
router.get('/:id', getSegmentById);
router.get('/:id/performance', getSegmentPerformance);
router.get('/:id/customers', getCustomersPreview);
router.post('/', validateSegment, createSegment);
router.put('/:id', validateSegmentUpdate, updateSegment);
router.delete('/:id', deleteSegment);

module.exports = router;
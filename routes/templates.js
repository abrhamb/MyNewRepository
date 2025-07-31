const express = require('express');
const { body } = require('express-validator');
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  cloneTemplate,
  renderTemplate,
  getCategories
} = require('../controllers/templateController');

const router = express.Router();

// Validation middleware
const validateTemplate = [
  body('name').notEmpty().withMessage('Template name is required'),
  body('subject').notEmpty().withMessage('Email subject is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('html').notEmpty().withMessage('HTML content is required'),
  body('text').optional().isString().withMessage('Text content must be a string'),
  body('variables').optional().isArray().withMessage('Variables must be an array')
];

const validateTemplateUpdate = [
  body('name').optional().notEmpty().withMessage('Template name cannot be empty'),
  body('subject').optional().notEmpty().withMessage('Email subject cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('html').optional().notEmpty().withMessage('HTML content cannot be empty'),
  body('text').optional().isString().withMessage('Text content must be a string'),
  body('variables').optional().isArray().withMessage('Variables must be an array')
];

// Routes
router.get('/categories', getCategories);
router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post('/', validateTemplate, createTemplate);
router.put('/:id', validateTemplateUpdate, updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/clone', cloneTemplate);
router.post('/:id/render', renderTemplate);

module.exports = router;
const express = require('express');
const { body } = require('express-validator');
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  cloneCampaign,
  getCampaignPreview,
  getDashboardStats
} = require('../controllers/campaignController');

const router = express.Router();

// Validation middleware
const validateCampaign = [
  body('name').notEmpty().withMessage('Campaign name is required'),
  body('subject').notEmpty().withMessage('Email subject is required'),
  body('templateId').isInt({ min: 1 }).withMessage('Valid template ID is required'),
  body('segmentId').isInt({ min: 1 }).withMessage('Valid segment ID is required'),
  body('type').optional().isIn(['email', 'sms']).withMessage('Type must be email or sms'),
  body('scheduledAt').optional().isISO8601().withMessage('Scheduled date must be valid ISO date')
];

const validateCampaignUpdate = [
  body('name').optional().notEmpty().withMessage('Campaign name cannot be empty'),
  body('subject').optional().notEmpty().withMessage('Email subject cannot be empty'),
  body('templateId').optional().isInt({ min: 1 }).withMessage('Valid template ID is required'),
  body('segmentId').optional().isInt({ min: 1 }).withMessage('Valid segment ID is required'),
  body('type').optional().isIn(['email', 'sms']).withMessage('Type must be email or sms'),
  body('scheduledAt').optional().isISO8601().withMessage('Scheduled date must be valid ISO date'),
  body('status').optional().isIn(['draft', 'scheduled', 'active', 'paused', 'sent']).withMessage('Invalid status')
];

// Routes
router.get('/stats', getDashboardStats);
router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.get('/:id/preview', getCampaignPreview);
router.post('/', validateCampaign, createCampaign);
router.put('/:id', validateCampaignUpdate, updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/send', sendCampaign);
router.post('/:id/clone', cloneCampaign);

module.exports = router;
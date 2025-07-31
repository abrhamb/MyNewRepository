const { validationResult } = require('express-validator');
const Campaign = require('../models/Campaign');
const EmailTemplate = require('../models/EmailTemplate');
const Segment = require('../models/Segment');

// Get all campaigns
const getCampaigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const campaigns = Campaign.getAll(parseInt(page), parseInt(limit), search, status);
    
    res.json({
      success: true,
      data: campaigns.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: campaigns.total,
        totalPages: Math.ceil(campaigns.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get campaign by ID
const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = Campaign.getById(parseInt(id));
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    next(error);
  }
};

// Create new campaign
const createCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { name, subject, templateId, type, segmentId, scheduledAt } = req.body;
    
    // Validate template exists
    const template = EmailTemplate.getById(templateId);
    if (!template) {
      return res.status(400).json({
        success: false,
        message: 'Email template not found'
      });
    }
    
    // Validate segment exists
    const segment = Segment.getById(segmentId);
    if (!segment) {
      return res.status(400).json({
        success: false,
        message: 'Customer segment not found'
      });
    }
    
    const campaign = Campaign.create({
      name,
      subject,
      templateId,
      type,
      segmentId,
      scheduledAt
    });
    
    res.status(201).json({
      success: true,
      data: campaign,
      message: 'Campaign created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update campaign
const updateCampaign = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // Check if campaign exists
    const existingCampaign = Campaign.getById(parseInt(id));
    if (!existingCampaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Prevent updating sent campaigns
    if (existingCampaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update sent campaigns'
      });
    }
    
    // Validate template if provided
    if (updates.templateId) {
      const template = EmailTemplate.getById(updates.templateId);
      if (!template) {
        return res.status(400).json({
          success: false,
          message: 'Email template not found'
        });
      }
    }
    
    // Validate segment if provided
    if (updates.segmentId) {
      const segment = Segment.getById(updates.segmentId);
      if (!segment) {
        return res.status(400).json({
          success: false,
          message: 'Customer segment not found'
        });
      }
    }
    
    const campaign = Campaign.update(parseInt(id), updates);
    
    res.json({
      success: true,
      data: campaign,
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete campaign
const deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = Campaign.getById(parseInt(id));
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    // Prevent deleting sent campaigns
    if (campaign.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete sent campaigns'
      });
    }
    
    const deleted = Campaign.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Send campaign
const sendCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = Campaign.getById(parseInt(id));
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Campaign must be in draft or scheduled status to send'
      });
    }
    
    // Get template and segment
    const template = EmailTemplate.getById(campaign.templateId);
    const segment = Segment.getById(campaign.segmentId);
    
    if (!template || !segment) {
      return res.status(400).json({
        success: false,
        message: 'Campaign template or segment not found'
      });
    }
    
    // Mock sending process
    const mockStats = {
      sent: segment.customerCount,
      delivered: Math.floor(segment.customerCount * 0.98),
      opened: Math.floor(segment.customerCount * 0.25),
      clicked: Math.floor(segment.customerCount * 0.08),
      bounced: Math.floor(segment.customerCount * 0.02),
      unsubscribed: Math.floor(segment.customerCount * 0.01)
    };
    
    // Update campaign status and stats
    const updatedCampaign = Campaign.update(parseInt(id), {
      status: 'sent',
      sentAt: new Date().toISOString(),
      stats: mockStats
    });
    
    res.json({
      success: true,
      data: updatedCampaign,
      message: 'Campaign sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Clone campaign
const cloneCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const campaign = Campaign.getById(parseInt(id));
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    const clonedCampaign = Campaign.create({
      name: name || `${campaign.name} (Copy)`,
      subject: campaign.subject,
      templateId: campaign.templateId,
      type: campaign.type,
      segmentId: campaign.segmentId,
      scheduledAt: null
    });
    
    res.status(201).json({
      success: true,
      data: clonedCampaign,
      message: 'Campaign cloned successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get campaign preview
const getCampaignPreview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = Campaign.getById(parseInt(id));
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }
    
    const template = EmailTemplate.getById(campaign.templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Mock variables for preview
    const mockVariables = {
      first_name: 'John',
      company_name: 'Your Company',
      cta_url: 'https://example.com',
      product_name: 'Amazing Product',
      product_image: 'https://via.placeholder.com/500x300',
      product_description: 'This is an amazing product that will change your life.',
      discount_price: '$99.99',
      original_price: '$149.99',
      shop_url: 'https://shop.example.com'
    };
    
    const renderedTemplate = EmailTemplate.renderTemplate(campaign.templateId, mockVariables);
    
    res.json({
      success: true,
      data: {
        campaignId: campaign.id,
        campaignName: campaign.name,
        subject: renderedTemplate.subject,
        html: renderedTemplate.html,
        text: renderedTemplate.text
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = Campaign.getDashboardStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  cloneCampaign,
  getCampaignPreview,
  getDashboardStats
};
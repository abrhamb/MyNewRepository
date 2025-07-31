const { validationResult } = require('express-validator');
const EmailTemplate = require('../models/EmailTemplate');

// Get all templates
const getTemplates = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const templates = EmailTemplate.getAll(parseInt(page), parseInt(limit), search, category);
    
    res.json({
      success: true,
      data: templates.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: templates.total,
        totalPages: Math.ceil(templates.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get template by ID
const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = EmailTemplate.getById(parseInt(id));
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// Create new template
const createTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { name, subject, category, html, text, variables } = req.body;
    
    const template = EmailTemplate.create({
      name,
      subject,
      category,
      html,
      text,
      variables
    });
    
    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update template
const updateTemplate = async (req, res, next) => {
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
    
    const template = EmailTemplate.update(parseInt(id), updates);
    
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete template
const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = EmailTemplate.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Clone template
const cloneTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const clonedTemplate = EmailTemplate.clone(parseInt(id), name);
    
    if (!clonedTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.status(201).json({
      success: true,
      data: clonedTemplate,
      message: 'Template cloned successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Render template with variables
const renderTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { variables = {} } = req.body;
    
    const renderedTemplate = EmailTemplate.renderTemplate(parseInt(id), variables);
    
    if (!renderedTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    res.json({
      success: true,
      data: renderedTemplate
    });
  } catch (error) {
    next(error);
  }
};

// Get template categories
const getCategories = async (req, res, next) => {
  try {
    const categories = EmailTemplate.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  cloneTemplate,
  renderTemplate,
  getCategories
};
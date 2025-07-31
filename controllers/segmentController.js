const { validationResult } = require('express-validator');
const Segment = require('../models/Segment');

// Get all segments
const getSegments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const segments = Segment.getAll(parseInt(page), parseInt(limit), search);
    
    res.json({
      success: true,
      data: segments.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: segments.total,
        totalPages: Math.ceil(segments.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get segment by ID
const getSegmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const segment = Segment.getById(parseInt(id));
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      data: segment
    });
  } catch (error) {
    next(error);
  }
};

// Create new segment
const createSegment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { name, description, criteria } = req.body;
    
    const segment = Segment.create({
      name,
      description,
      criteria
    });
    
    res.status(201).json({
      success: true,
      data: segment,
      message: 'Segment created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update segment
const updateSegment = async (req, res, next) => {
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
    
    const segment = Segment.update(parseInt(id), updates);
    
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      data: segment,
      message: 'Segment updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete segment
const deleteSegment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = Segment.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Segment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Refresh customer counts for all segments
const refreshCustomerCounts = async (req, res, next) => {
  try {
    const segments = Segment.refreshCustomerCounts();
    
    res.json({
      success: true,
      data: segments,
      message: 'Customer counts refreshed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get segment performance
const getSegmentPerformance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const performance = Segment.getSegmentPerformance(parseInt(id));
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};

// Get customers preview for segment
const getCustomersPreview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;
    
    const preview = Segment.getCustomersPreview(parseInt(id), parseInt(limit));
    
    if (!preview) {
      return res.status(404).json({
        success: false,
        message: 'Segment not found'
      });
    }
    
    res.json({
      success: true,
      data: preview
    });
  } catch (error) {
    next(error);
  }
};

// Get available operators for building criteria
const getAvailableOperators = async (req, res, next) => {
  try {
    const operators = Segment.getAvailableOperators();
    
    res.json({
      success: true,
      data: operators
    });
  } catch (error) {
    next(error);
  }
};

// Get available fields for building criteria
const getAvailableFields = async (req, res, next) => {
  try {
    const fields = Segment.getAvailableFields();
    
    res.json({
      success: true,
      data: fields
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
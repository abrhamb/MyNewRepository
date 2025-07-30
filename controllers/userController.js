const { validationResult } = require('express-validator');
const User = require('../models/User');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const users = User.getAll(parseInt(page), parseInt(limit), search);
    
    res.json({
      success: true,
      data: users.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.total,
        totalPages: Math.ceil(users.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = User.getById(parseInt(id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { name, email, age } = req.body;
    
    // Check if email already exists
    if (User.getByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    const user = User.create({ name, email, age });
    
    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
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
    
    // Check if email already exists (if updating email)
    if (updates.email) {
      const existingUser = User.getByEmail(updates.email);
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }
    
    const user = User.update(parseInt(id), updates);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = User.delete(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
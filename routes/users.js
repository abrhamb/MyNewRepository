const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer')
];

const validateUserUpdate = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('age').optional().isInt({ min: 0 }).withMessage('Age must be a positive integer')
];

// Routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateUser, createUser);
router.put('/:id', validateUserUpdate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
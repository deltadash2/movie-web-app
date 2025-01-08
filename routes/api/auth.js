const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');

const userController = require('../../controllers/userController');

// Login
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  userController.loginUser
);

// Get user by token
router.get('/', auth, userController.getUserProfile);

module.exports = router;

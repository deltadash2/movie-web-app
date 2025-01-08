const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const userController = require('../../controllers/userController');

// Register user
router.post(
  '/',
  // check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 8 }),
  userController.createUser
);

module.exports = router;

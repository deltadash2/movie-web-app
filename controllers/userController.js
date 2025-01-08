const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name = 'test', email, password } = req.body;

  try {
    let user = await userService.getByEmail(email);

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = await userService.create({
      name,
      email,
      password
    });

    const payload = {
      user: {
        email: user.email
      }
    };

    jwt.sign(
      payload,
      appConfig.JWT_SECRET,
      { expiresIn: appConfig.JWT_EXPIRY },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await userService.getByEmail(email);

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(
      password,
      (
        await userService.getPasswordByEmail(email)
      ).password
    );

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const payload = {
      user: {
        email: user.email
      }
    };

    jwt.sign(
      payload,
      appConfig.JWT_SECRET,
      { expiresIn: appConfig.JWT_EXPIRY },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

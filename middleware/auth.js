const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');

module.exports = function (req, res, next) {
  // Get token from header
  let token = req.header('Authorization');
  if (token && token.startsWith('Bearer ')) {
    token = token.substring(7);
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(token, appConfig.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

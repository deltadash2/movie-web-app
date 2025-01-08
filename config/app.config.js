module.exports = {
  JWT_SECRET: process.env.JWT_SECRET_KEY || 'DEFAULT_SECRET_KEY',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '5d'
};

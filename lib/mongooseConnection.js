const dbConfig = require('../config/db.config');

const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB = dbConfig.MONGODB_URI;
const mongoOptions = {
  useNewUrlParser: true
};

mongoose.connect(mongoDB, mongoOptions).catch((err) => {
  console.error('Error connecting to MongoDB: ' + err);
  process.exit();
});

mongoose.connection.on('connected', function () {
  console.log('Connection made to Mongo at: ' + mongoDB);
});

// If the connection throws an error after initially connecting
mongoose.connection.on('error', function (err) {
  console.log('Mongo connection error: ' + err);
  process.exit();
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoo connection disconnected');
});

module.exports = mongoose;

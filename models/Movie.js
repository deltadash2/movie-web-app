var mongoose = require('../lib/mongooseConnection');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    publish_year: {
      type: String
    },
    thumbnail: {
      type: String
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('movie', MovieSchema);

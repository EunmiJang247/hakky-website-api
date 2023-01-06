const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const counselorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
counselorSchema.plugin(toJSON);
counselorSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Counselor = mongoose.model('Counselor', counselorSchema);

module.exports = Counselor;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const youtubeSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
youtubeSchema.plugin(toJSON);
youtubeSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Youtube = mongoose.model('Youtube', youtubeSchema);

module.exports = Youtube;

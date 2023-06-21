const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const noticeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isImportant: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
noticeSchema.plugin(toJSON);
noticeSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;

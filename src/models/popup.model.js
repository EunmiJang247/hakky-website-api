const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const popupSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
popupSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Popup = mongoose.model('Popup', popupSchema);

module.exports = Popup;

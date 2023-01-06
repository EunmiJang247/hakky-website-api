const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

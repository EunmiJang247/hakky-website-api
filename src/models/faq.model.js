const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
faqSchema.plugin(toJSON);
faqSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;

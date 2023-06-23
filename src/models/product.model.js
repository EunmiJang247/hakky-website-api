const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const optionsSchema = mongoose.Schema({
  name: {
    type: String,
  },
  time: {
    type: Number,
  },
  detail: {
    type: String,
  },
  price: {
    type: String,
  },
});

const productSchema = mongoose.Schema(
  {
    place: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
    options: [optionsSchema],
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PortFolio = mongoose.model('PortFolio', portfolioSchema);

module.exports = PortFolio;

const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    applicant: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    deposit: {
      type: String,
      required: true,
    },
    reservationAt: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    adminNote: {
      type: String,
      required: true,
    },
    isCanceld: {
      type: Boolean,
      required: true,
      default: false,
    },
    isApproval: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Reservation
 */
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

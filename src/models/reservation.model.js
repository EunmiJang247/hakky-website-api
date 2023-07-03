const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    applicant: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    place: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    deposit: {
      type: String,
      required: true,
    },
    reservationFrom: {
      type: Date,
      required: true,
    },
    reservationTo: {
      type: Date,
      required: true,
    },
    reservationTime: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    adminNote: {
      type: String,
      required: false,
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
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    isChanged: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef Reservation
 */
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

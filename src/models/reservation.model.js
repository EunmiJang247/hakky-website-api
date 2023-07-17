const mongoose = require('mongoose');

const reservationProductSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
);

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
    products: {
      type: [reservationProductSchema],
      required: true,
    },
    deposit: {
      type: Number,
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
    isCanceled: {
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

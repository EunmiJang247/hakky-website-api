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
      required: false,
    },
    customerName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    isAdminCreate: {
      type: Boolean,
      required: true,
      default: false,
    },
    placeId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    placeName: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: false,
    },
    products: {
      type: [reservationProductSchema],
      required: true,
    },
    reservationDate: {
      type: Date,
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
    depositDeadline: {
      type: Date,
      required: true,
    },
    reservationTime: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    adminNote: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    deposit: {
      type: Number,
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

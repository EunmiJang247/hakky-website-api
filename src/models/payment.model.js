const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    applicant: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    refund: {
      type: Boolean,
      required: true,
    },
    isDeposit: {
      type: Boolean,
      required: true,
      defalut: false,
    },
    reservationId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

const mongoose = require('mongoose');

// deposit === 원금(현장에서 반씩 결제)
// deposit === 입금액
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
    deposit: {
      type: Number,
      required: true,
    },
    isRefund: {
      type: Boolean,
      required: true,
    },
    depositDeadline: {
      type: Date,
      required: true,
    },
    isDeposit: {
      type: Boolean,
      required: true,
      defalut: false,
    },
    reservationId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    paymentKey: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    virtualAccount: {
      type: String,
      required: false,
    },
    virtualAccountOwner: {
      type: String,
      required: false,
    },
    cashReceipt: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

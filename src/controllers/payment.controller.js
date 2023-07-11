const { paymentService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.createPayment(req.body);
  // todo create reservation
  res.send(payment);
});

const readPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.readPayment(req.params.paymentId);
  res.send(payment);
});

const readPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.readPayments(req.query.keyword, req.query.startDate, req.query.startDate, req.query.applicant);
  // maybe pagination
  res.send(payments);
});

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

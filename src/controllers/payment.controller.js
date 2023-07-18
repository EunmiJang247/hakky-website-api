const { paymentService, reservationService } = require('../services');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createPayment = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const isAmountValid = await paymentService.checkValidAmount(req.body.products, req.body.amount);
  const isTimeValid = await paymentService.chedckValidTime(req.body.products, req.body.reservationTime);

  if (!isAmountValid || !isTimeValid) {
    throw new ApiError(400, 'payment info does not valid');
  }

  const now = new Date();
  const payment = await paymentService.createPayment(req.body, userId, now);
  const reservation = await reservationService.createReservation(req.body, payment._id, userId);
  await paymentService.tossVirtualAccountCreate(payment);

  const result = await reservationService.serializer(reservation);

  res.send(result);
});

const readPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.readPayment(req.params.paymentId);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const readPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.readPayments(req.query.keyword, req.query.from, req.query.to, req.query.applicant);
  const result = await Promise.all(payments.result.map(paymentService.serializer));
  res.send({
    result,
    count: payments.count,
  });
});

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

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

  payment.reservationId = reservation._id;
  await paymentService.tossVirtualAccountCreate(payment);
  payment.save();
  const result = await reservationService.serializer(reservation);

  res.send(result);
});

const readPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.readPayment(req.params.paymentId);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const refund = catchAsync(async (req, res) => {
  const payment = await paymentService.refund(req.params.paymentId);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const refundAndCancel = catchAsync(async (req, res) => {
  const payment = await paymentService.refundAndCancel(req.params.paymentId);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const readPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.readPayments(req.query.keywords, req.query.from, req.query.to, req.query.limit, req.query.skip);
  const result = await Promise.all(payments.result.map(paymentService.serializer));
  res.send({
    result,
    count: payments.count,
  });
});

const statistic = catchAsync(async (req, res) => {
  const payments = await paymentService.statistic({
    startDate: req.query.startDate,
    endDate: req.qeury.endDate,
    limit: req.query.limit,
    skip: req.query.skip,
    placeId: req.query.placeId,
    refundState: req.query.refundState,
  });

  const result = await Promise.all(payments.result.map(paymentService.serializer));
  res.send({
    result,
    amount: payments.amount,
    canceledAmount: payments.canceledAmount,
    count: payments.paymentCount,
  });
});

const subAdminReadPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.subAdminReadPayments(req.query.keywords, req.query.placeId, req.query.from, req.query.to, req.query.limit, req.query.skip);
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
  subAdminReadPayments,
  refund,
  refundAndCancel,
  statistic,
};

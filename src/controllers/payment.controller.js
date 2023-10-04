const { paymentService, reservationService } = require('../services');
const { updatePaymentByWebhook } = require('../services/payment.service');
const ApiError = require('../utils/ApiError');
const { textReservationComplete } = require('../utils/aligo');
const catchAsync = require('../utils/catchAsync');
const { newOlderDate } = require('../utils/new-older-date');

const createPayment = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const isAmountValid = await paymentService.checkValidAmount(req.body.products, req.body.amount);
  const isTimeValid = await paymentService.chedckValidTime(req.body.products, req.body.reservationTime);

  if (!isAmountValid || !isTimeValid) {
    throw new ApiError(400, 'payment info does not valid');
  }

  const now = new Date();
  const payment = await paymentService.createPayment(req.body, userId, now);
  const reservation = await reservationService.createReservation(req.body, payment._id, userId, now);

  payment.reservationId = reservation._id;
  await paymentService.tossVirtualAccountCreate(payment);
  payment.save();

  const paymentDoc = await paymentService.readPayment(payment._id);
  await textReservationComplete(paymentDoc, reservation);
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

const refundByUser = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const check = await paymentService.readPayment(req.params.paymentId);
  const oneYearsOlderDate = newOlderDate({ date: check.createdAt, years: 1 });
  if (new Date() > oneYearsOlderDate) {
    throw new ApiError(404, 'FAILED_TO_AUTO_REFUND');
  }
  if (String(check.applicant) !== String(userId)) {
    throw new ApiError(403, 'NOT_AUTHORIZED');
  }
  const payment = await paymentService.refundAndCancel(req.params.paymentId, req.body);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const refundAndCancel = catchAsync(async (req, res) => {
  const payment = await paymentService.refundAndCancel(req.params.paymentId, req.body);
  const result = await paymentService.serializer(payment);
  res.send(result);
});

const readPayments = catchAsync(async (req, res) => {
  const payments = await paymentService.readPayments(req.query.keywords, req.query.from, req.query.to, req.query.limit, req.query.skip, req.query.placeId);
  const result = await Promise.all(payments.result.map(paymentService.serializer));
  res.send({
    result,
    count: payments.count,
  });
});

const statistic = catchAsync(async (req, res) => {
  const payments = await paymentService.statistic({
    startDate: req.query.startDate,
    endDate: req.query.endDate,
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
    count: payments.count,
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

const tossDepositCallback = catchAsync(async (req, res) => {
  const tossPayment = req.body;
  if (tossPayment.secret) {
    const payments = await paymentService.readPaymentBySecretKey(req.body.secret);
    if (payments.length === 0) {
      res.status(400).end();
    }
    await updatePaymentByWebhook(payments[0], req.body.status);
    res.status(200).end();
  }
  // payment.save();
  // const result = await reservationService.serializer(reservation);
  // res.send(result);
});

module.exports = {
  createPayment,
  readPayment,
  readPayments,
  subAdminReadPayments,
  refund,
  refundByUser,
  refundAndCancel,
  statistic,
  tossDepositCallback,
};

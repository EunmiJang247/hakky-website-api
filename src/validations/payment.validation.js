const Joi = require('joi');

const createPayment = {
  body: Joi.object().keys({
    price: Joi.number().required(),
    placeId: Joi.string().required(),
    products: Joi.array().items(Joi.object()),
    reservationFrom: Joi.date().required(),
    reservationTo: Joi.date().required(),
    reservationTime: Joi.number().required(),
    note: Joi.string().required().allow(''),
    paymentKey: Joi.string().required(),
    orderId: Joi.string().required(),
    amount: Joi.number().required(),
  }).required(),
};

const readPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().required(),
  }).required(),
};

const refund = {
  params: Joi.object().keys({
    paymentId: Joi.string().required(),
  }).required(),
};

const refundAndCancel = {
  params: Joi.object().keys({
    paymentId: Joi.string().required(),
    refundReceiveAccount: Joi.object({
      bank: Joi.string().required(),
      accountNumber: Joi.string().required(),
      holderName: Joi.string().required(),
    }).required(),
    cancelReason: Joi.string().required(),
  }).required(),
};

const readPayments = {
  query: Joi.object().keys({
    keywords: Joi.string().allow(''),
    from: Joi.date(),
    to: Joi.date(),
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }).required(),
};

const subAdminReadPayments = {
  query: Joi.object().keys({
    keywords: Joi.string().allow(''),
    placeId: Joi.string().required(),
    from: Joi.date(),
    to: Joi.date(),
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }).required(),
};

const statistic = {
  query: Joi.object().keys({
    placeId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    refundState: Joi.string().required(),
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }).required(),
};

module.exports = {
  createPayment,
  readPayment,
  readPayments,
  subAdminReadPayments,
  refund,
  refundAndCancel,
  statistic,
};

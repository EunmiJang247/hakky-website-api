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

const readPayments = {
  query: Joi.object().keys({
    keywords: Joi.string().allow(''),
    from: Joi.date(),
    to: Joi.date(),
    applicant: Joi.string(),
    limit: Joi.number().required(),
    skip: Joi.date().required(),
  }).required(),
};

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

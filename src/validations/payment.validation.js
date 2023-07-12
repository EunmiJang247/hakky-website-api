const Joi = require('joi');

const createPayment = {
  body: Joi.object().keys({
    price: Joi.number().required(),
    applicant: Joi.string().required(),
    product: Joi.array().items(Joi.object()),
    reservationFrom: Joi.date().required(),
    reservationTo: Joi.date().required(),
    reservationTime: Joi.number().required(),
    note: Joi.string().required(),
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
  }).required(),
};

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

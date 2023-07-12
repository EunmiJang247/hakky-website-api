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

module.exports = {
  createPayment,
};

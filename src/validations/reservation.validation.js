const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReservation = {
  body: Joi.object()
    .keys({
      place: Joi.string().required().custom(objectId),
      applicant: Joi.string().required().custom(objectId),
      price: Joi.number().required(),
      productName: Joi.string().required(),
      deposit: Joi.string().required(),
      reservationFrom: Joi.date().required(),
      reservationTo: Joi.date().required(),
      reservationTime: Joi.date().required(),
      note: Joi.string(),
    })
    .required(),
};

const adminGetReservations = {
  query: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
    applicant: Joi.string().custom(objectId),
    from: Joi.date(),
    to: Joi.date(),
    limit: Joi.number(),
    skip: Joi.number(),
  }).required(),
};

const getReservations = {
  query: Joi.object().keys({
    status: Joi.string().required(),
  }).required(),
};

const getReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

const updateReservation = {
  params: Joi.object().keys({
    reservationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      place: Joi.string().custom(objectId),
      applicant: Joi.string().custom(objectId),
      price: Joi.number(),
      productName: Joi.string(),
      deposit: Joi.string(),
      reservationFrom: Joi.date(),
      reservationTo: Joi.date(),
      reservationTime: Joi.date(),
      note: Joi.string(),
    })
    .required(),
};

const cancelReservation = {
  params: Joi.object().keys({
    reservationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  adminGetReservations,
  updateReservation,
  cancelReservation,
};

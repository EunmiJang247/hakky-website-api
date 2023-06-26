const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlace = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    phone: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    postalCode: Joi.string().required(),
    author: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      tag: Joi.string().required(),
      instagram: Joi.string().required(),
      images: Joi.array().items(Joi.string()).required(),
    }).required(),
  }).required(),
};

const getPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getPlaceDetial = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
    year: Joi.string().required(),
    month: Joi.string().required(),
    day: Joi.string().required(),
  }),
};

const updatePlace = {
  params: Joi.object().keys({
    placeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      link: Joi.string().required(),
    })
    .min(1),
};

const deletePlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPlace,
  getPlace,
  updatePlace,
  deletePlace,
  getPlaceDetial,
};

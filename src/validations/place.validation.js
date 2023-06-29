const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlace = {
  body: Joi.object().keys({
    subAdmin: Joi.string(),
    name: Joi.string().required(),
    images: Joi.array().items(Joi.object()).required(),
    phone: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    postalCode: Joi.string().required(),
    author: Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
      tag: Joi.string().required(),
      instagram: Joi.string().required(),
      images: Joi.array().items(Joi.object()).required(),
    }).required(),
  }).required(),
};

const getPlace = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getPlaceDetail = {
  params: Joi.object().keys({
    placeId: Joi.string().custom(objectId).required(),
    year: Joi.string().required(),
    month: Joi.string().required(),
    day: Joi.string().required(),
    dayOfWeek: Joi.number().required(),
  }),
};

const updatePlace = {
  params: Joi.object().keys({
    placeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      subAdmin: Joi.string(),
      name: Joi.string(),
      images: Joi.array().items(Joi.object()),
      phone: Joi.string(),
      address1: Joi.string(),
      address2: Joi.string(),
      postalCode: Joi.string(),
      author: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        tag: Joi.string(),
        instagram: Joi.string(),
        images: Joi.array().items(Joi.object()),
      }),
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
  getPlaceDetail,
};

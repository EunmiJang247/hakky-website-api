const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlace = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    images: Joi.array(Joi.string()).required(),
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
      images: Joi.array(Joi.string()).required(),
    }).required(),
  }).required(),
};

const getPlace = {
  params: Joi.object().keys({
    popupId: Joi.string().custom(objectId),
  }),
};

const updatePlace = {
  params: Joi.object().keys({
    popupId: Joi.required().custom(objectId),
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
    popupId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPlace,
  getPlace,
  updatePlace,
  deletePlace,
};

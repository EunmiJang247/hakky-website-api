const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCounselor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    score: Joi.string().required(),
    profile: Joi.string().required().uri(),
    description: Joi.string().required(),
  }),
};

const getCounselor = {
  params: Joi.object().keys({
    counselorId: Joi.string().custom(objectId),
  }),
};

const updateCounselor = {
  params: Joi.object().keys({
    counselorId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      score: Joi.string().required(),
      image: Joi.string().required().uri(),
      description: Joi.string().required(),
    })
    .min(1),
};

const deleteCounselor = {
  params: Joi.object().keys({
    counselorId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCounselor,
  getCounselor,
  updateCounselor,
  deleteCounselor,
};

const Joi = require('joi');

const updateBanner = {
  body: Joi.object().keys({
    banner1: Joi.object().keys({
      name: Joi.string(),
      image: Joi.string(),
      link: Joi.string(),
    }),
    banner2: Joi.object().keys({
      name: Joi.string(),
      image: Joi.string(),
      link: Joi.string(),
    }),
    banner3: Joi.object().keys({
      name: Joi.string(),
      image: Joi.string(),
      link: Joi.string(),
    }),
    banner4: Joi.object().keys({
      name: Joi.string(),
      image: Joi.string(),
      link: Joi.string(),
    }),
  }).required(),
};

module.exports = updateBanner;

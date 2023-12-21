const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createYoutube = {
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
};

const getYoutubes = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const getYoutube = {
  params: Joi.object().keys({
    youtubeId: Joi.string().custom(objectId),
  }),
};

const updateYoutube = {
  params: Joi.object().keys({
    youtubeId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    link: Joi.string().required(),
  }),
};

module.exports = {
  createYoutube,
  getYoutubes,
  getYoutube,
  updateYoutube,
};

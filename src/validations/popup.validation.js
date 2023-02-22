const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPopup = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const getPopup = {
  params: Joi.object().keys({
    popupId: Joi.string().custom(objectId),
  }),
};

const updatePopup = {
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

const deletePopup = {
  params: Joi.object().keys({
    popupId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPopup,
  getPopup,
  updatePopup,
  deletePopup,
};

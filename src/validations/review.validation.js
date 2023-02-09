const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    reviewer: Joi.string().required(),
    user: Joi.string().required(),
    score: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      reviewer: Joi.string().required(),
      user: Joi.string().required(),
      score: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  getReview,
  updateReview,
  deleteReview,
};

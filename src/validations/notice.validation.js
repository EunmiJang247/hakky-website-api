const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotice = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const getNotice = {
  params: Joi.object().keys({
    noticeId: Joi.string().custom(objectId),
  }),
};

const updateNotice = {
  params: Joi.object().keys({
    noticeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required(),
      content: Joi.string().required(),
    })
    .min(1),
};

const deleteNotice = {
  params: Joi.object().keys({
    noticeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNotice,
  getNotice,
  updateNotice,
  deleteNotice,
};

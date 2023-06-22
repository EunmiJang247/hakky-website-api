const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotice = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    isImportant: Joi.boolean().required(),
  }),
};

const getNotice = {
  params: Joi.object().keys({
    noticeId: Joi.string().custom(objectId),
  }),
};

const getNotices = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
    important: Joi.boolean().required(),
    keyword: Joi.string().allow(''),
  }),
};

const updateNotice = {
  params: Joi.object().keys({
    noticeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      content: Joi.string(),
      isImportant: Joi.boolean(),
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
  getNotices,
  updateNotice,
  deleteNotice,
};

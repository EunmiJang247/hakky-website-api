const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createContact = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const getContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};

const updateContact = {
  params: Joi.object().keys({
    contactId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      content: Joi.string().required(),
    })
    .min(1),
};

const deleteContact = {
  params: Joi.object().keys({
    contactId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

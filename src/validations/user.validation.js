const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    keyword: Joi.string().allow(''),
    limit: Joi.number().integer(),
    skip: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }).required(),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      phoneNumber: Joi.string(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .required(),
};

const adminUpdateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      role: Joi.string(),
      phoneNumber: Joi.string(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .required(),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  adminUpdateUser,
};

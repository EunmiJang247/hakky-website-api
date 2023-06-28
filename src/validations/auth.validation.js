const Joi = require('joi');
// const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    authenticationNumber: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    // password: Joi.string().required().custom(password),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

const registerNaver = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    // password: Joi.string().required().custom(password),
    password: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  registerNaver,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

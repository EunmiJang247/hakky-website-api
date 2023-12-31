const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    loginId: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const registerNaver = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
};

const registerKakao = {
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    loginId: Joi.string().required(),
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
  body: Joi.object().keys({
    identifier: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const resetPasswordMypage = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

const subAdminResetPassword = {
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

const generateAuthcode = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
  }),
};

const verifyAuthcode = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required(),
    identifier: Joi.string().required(),
  }),
};

module.exports = {
  register,
  registerNaver,
  registerKakao,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPasswordMypage,
  resetPassword,
  subAdminResetPassword,
  verifyEmail,
  generateAuthcode,
  verifyAuthcode,
};

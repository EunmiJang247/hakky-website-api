const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { authCodeService } = require('.');
const { AuthCode } = require('../models');

const loginUserWithPhoneNumberAndPassword = async (phoneNumber, password) => {
  const user = await userService.getUserByPhoneNumber(phoneNumber);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect phoneNumber or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, identifier, phoneNumber, newPassword) => {
  try {
    const authCodeDoc = await authCodeService.getAuthCodeByIdentifier(identifier, phoneNumber);
    if (!authCodeDoc) {
      throw new ApiError(httpStatus.FORBIDDEN, 'authcode does not exist');
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await AuthCode.deleteMany({ identifier, phoneNumber });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const resetPasswordMypage = async (userId, password, newPassword) => {
  const user = await userService.getUserById(userId);
  if (!user || !await user.isPasswordMatch(password)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'PASSWORD_DOES_NOT_MATCHED');
  }
  user.password = newPassword;
  await user.save();
  return user;
};

const subAdminResetPassword = async (userId, newPassword) => {
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithPhoneNumberAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  resetPasswordMypage,
  subAdminResetPassword,
  verifyEmail,
};

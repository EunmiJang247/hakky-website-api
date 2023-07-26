const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const naverProfile = require('../utils/naverLogin');
const kakaoProfile = require('../utils/kakaoLogin');
const ApiError = require('../utils/ApiError');
const {
  authService, userService, authCodeService, emailService, tokenService,
} = require('../services');

const generateAuthcode = catchAsync(async (req, res) => {
  await authCodeService.createAuthCodeByPhoneNumber(req.body.phoneNumber);
  res.send();
});

const verifyAuthcode = catchAsync(async (req, res) => {
  const result = await authCodeService.getAuthCodeByIdentifier(req.body.identifier, req.body.phoneNumber);
  if (result) {
    res.send('verified');
  } else {
    res.send('try again');
  }
});

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerNaver = catchAsync(async (req, res) => {
  const naverInfo = await naverProfile(req.body.accessToken);
  const user = await userService.createUserNaver(naverInfo);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const registerKakao = catchAsync(async (req, res) => {
  if (req.query.error || req.query.errorMessage) {
    throw new ApiError(httpStatus.BAD_REQUEST, req.query.errorMessage);
  }

  // todo crteate user
  const kakaoInfo = await kakaoProfile(req.body.code);
  res.status(httpStatus.CREATED).send(kakaoInfo);
});

const login = catchAsync(async (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = await authService.loginUserWithPhoneNumberAndPassword(phoneNumber, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.identifier, req.body.phoneNumber, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const subAdminResetPassword = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  await authService.subAdminResetPassword(userId, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkToken = catchAsync(async (req, res) => {
  const { user } = req;
  res.status(httpStatus.OK).send({ user });
});

module.exports = {
  register,
  registerNaver,
  registerKakao,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  subAdminResetPassword,
  sendVerificationEmail,
  verifyEmail,
  checkToken,
  generateAuthcode,
  verifyAuthcode,
};

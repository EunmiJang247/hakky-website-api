const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const adminCreateUser = catchAsync(async (req, res) => {
  const user = await userService.adminCreateUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const result = await userService.queryUsers(req.query.keyword, req.query.limit, req.query.skip);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getSubAdmins = catchAsync(async (req, res) => {
  const subAdmins = await userService.querySubAdmins(req.query.keyword, req.query.limit, req.query.skip);
  res.send(subAdmins);
});

const updateUser = catchAsync(async (req, res) => {
  await userService.updateUserByAutoFit(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

const adminUpdateUser = catchAsync(async (req, res) => {
  await userService.updateUserByAutoFit(req.params.userId, req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

const deleteUser = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  await userService.deleteUserById(userId);
  res.status(httpStatus.NO_CONTENT).end();
});

const deleteUserByAdmin = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  adminCreateUser,
  createUser,
  getUsers,
  getUser,
  getSubAdmins,
  updateUser,
  deleteUser,
  deleteUserByAdmin,
  adminUpdateUser,
};

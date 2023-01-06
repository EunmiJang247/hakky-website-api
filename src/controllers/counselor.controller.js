const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { counselorService } = require('../services');
const pick = require('../utils/pick');

const createCounselor = catchAsync(async (req, res) => {
  const user = await counselorService.createCounselor(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getCounselors = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await counselorService.queryCounselors({}, options);
  res.send(result);
});

const getCounselor = catchAsync(async (req, res) => {
  const user = await counselorService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Counselor not found');
  }
  res.send(user);
});

const updateCounselor = catchAsync(async (req, res) => {
  const user = await counselorService.updateCounselorById(req.params.userId, req.body);
  res.send(user);
});

const deleteCounselor = catchAsync(async (req, res) => {
  await counselorService.deleteCounselorById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCounselor,
  getCounselors,
  getCounselor,
  updateCounselor,
  deleteCounselor,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bannerService } = require('../services');

const createBanner = catchAsync(async (req, res) => {
  const excludeSchedule = await bannerService.createBanner(req.body);
  res.status(httpStatus.CREATED).send(excludeSchedule);
});

const getBanner = catchAsync(async (req, res) => {
  const excludeSchedule = await bannerService.getBanner();
  if (!excludeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  res.send(excludeSchedule);
});

const updateBanner = catchAsync(async (req, res) => {
  const excludeSchedule = await bannerService.updateBanner(req.params.excludeScheduleId, req.body);
  res.send(excludeSchedule);
});

module.exports = {
  createBanner,
  getBanner,
  updateBanner,
};

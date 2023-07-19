const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bannerService } = require('../services');

const createBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.createBanner(req.body);
  res.status(httpStatus.CREATED).send(banner);
});

const getBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.getBanner();
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  res.send(banner);
});

const updateBanner = catchAsync(async (req, res) => {
  const banner = await bannerService.updateBanner(req.body);
  res.send(banner);
});

module.exports = {
  createBanner,
  getBanner,
  updateBanner,
};

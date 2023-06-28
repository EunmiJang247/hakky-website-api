const httpStatus = require('http-status');
const { MainPageBanner } = require('../models');
const ApiError = require('../utils/ApiError');

const createBanner = async (placeBody) => MainPageBanner.create(placeBody);

const getBanner = async () => {
  const banner = await MainPageBanner.findOne();
  return banner;
};

const updateBanner = async (updateBody) => {
  const banner = await getBanner();
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'banner not found');
  }
  Object.assign(banner, updateBody);
  await banner.save();
  return banner;
};

module.exports = {
  createBanner,
  getBanner,
  updateBanner,
};

const httpStatus = require('http-status');
const { IncludeSchedule } = require('../models');
const ApiError = require('../utils/ApiError');

const createIncludeSchedule = async (scheduleBody) => IncludeSchedule.create(scheduleBody);

const getIncludeSchedule = async (placeId) => {
  const places = await IncludeSchedule.find({ place: placeId });
  return places;
};

const getIncludeScheduleById = async (id) => {
  const detailData = await IncludeSchedule.findById(id);
  return detailData;
};

const updateIncludeSchedule = async (includeScheduleId, updateBody) => {
  const product = await getIncludeScheduleById(includeScheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncludeSchedule not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteIncludeScheduleById = async (includeScheduleId) => {
  const product = await getIncludeScheduleById(includeScheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'IncludeSchedule not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  createIncludeSchedule,
  getIncludeSchedule,
  getIncludeScheduleById,
  deleteIncludeScheduleById,
  updateIncludeSchedule,
};

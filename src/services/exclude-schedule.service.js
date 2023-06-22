const httpStatus = require('http-status');
const { ExcludeSchedule } = require('../models');
const ApiError = require('../utils/ApiError');

const createExcludeSchedule = async (scheduleBody) => {
  return ExcludeSchedule.create(scheduleBody);
};

const getExcludeSchedule = async (placeId) => {
  const places = await ExcludeSchedule.find({ place: placeId });
  return places;
};

const getExcludeScheduleById = async (id) => {
  const detailData = await ExcludeSchedule.findById(id);
  return detailData;
};

const updateExcludeSchedule = async (ExcludeScheduleId, updateBody) => {
  const product = await getExcludeScheduleById(ExcludeScheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExcludeSchedule not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteExcludeScheduleById = async (ExcludeScheduleId) => {
  const product = await getExcludeScheduleById(ExcludeScheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExcludeSchedule not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  createExcludeSchedule,
  getExcludeSchedule,
  getExcludeScheduleById,
  deleteExcludeScheduleById,
  updateExcludeSchedule,
};

const httpStatus = require('http-status');
const { PlaceIdle } = require('../models');
const ApiError = require('../utils/ApiError');

const createSchedule = async (scheduleBody) => PlaceIdle.Schedule.create(scheduleBody);

const getSchedules = async (placeId) => {
  const places = await PlaceIdle.Schedule.find({ place: placeId });
  return places;
};

const getScheduleById = async (id) => {
  const detailData = await PlaceIdle.Schedule.findById(id);
  return detailData;
};

const updateSchedule = async (scheduleId, updateBody) => {
  const product = await getScheduleById(scheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedlue not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteScheduleById = async (scheduleId) => {
  const product = await getScheduleById(scheduleId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  await product.remove();
  return product;
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  deleteScheduleById,
  updateSchedule,
};

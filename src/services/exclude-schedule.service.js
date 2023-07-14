const httpStatus = require('http-status');
const { PlaceIdle } = require('../models');
const ApiError = require('../utils/ApiError');

const createExcludeSchedule = async (scheduleBody) => PlaceIdle.ExcludeSchedule.create(scheduleBody);

const getExcludeSchedules = async (placeId) => {
  const excludeSchedules = await PlaceIdle.ExcludeSchedule.find({ place: placeId });
  return excludeSchedules;
};

const getExcludeScheduleById = async (id) => {
  const detailData = await PlaceIdle.ExcludeSchedule.findById(id);
  return detailData;
};

const updateExcludeSchedule = async (ExcludeScheduleId, updateBody) => {
  const excludeSchedule = await getExcludeScheduleById(ExcludeScheduleId);
  if (!excludeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExcludeSchedule not found');
  }
  Object.assign(excludeSchedule, updateBody);
  await excludeSchedule.save();
  return excludeSchedule;
};

const deleteExcludeScheduleById = async (ExcludeScheduleId) => {
  const excludeSchedule = await getExcludeScheduleById(ExcludeScheduleId);
  if (!excludeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ExcludeSchedule not found');
  }
  await excludeSchedule.remove();
  return excludeSchedule;
};

const serializer = async (excludeSchedule) => ({
  id: excludeSchedule._id,
  place: excludeSchedule.place,
  name: excludeSchedule.name,
  startAt: excludeSchedule.startAt,
  endAt: excludeSchedule.endAt,
  createdAt: excludeSchedule.createdAt,
});

module.exports = {
  createExcludeSchedule,
  getExcludeSchedules,
  getExcludeScheduleById,
  deleteExcludeScheduleById,
  updateExcludeSchedule,
  serializer,
};

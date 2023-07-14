const httpStatus = require('http-status');
const { PlaceIdle } = require('../models');
const ApiError = require('../utils/ApiError');

const createIncludeSchedule = async (scheduleBody) => PlaceIdle.IncludeSchedule.create(scheduleBody);

const getIncludeSchedules = async (placeId) => {
  const places = await PlaceIdle.IncludeSchedule.find({ place: placeId });
  return places;
};

const getIncludeScheduleById = async (id) => {
  const detailData = await PlaceIdle.IncludeSchedule.findById(id);
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

const serializer = (includeSchedule) => ({
  id: includeSchedule._id,
  place: includeSchedule.place,
  name: includeSchedule.name,
  date: includeSchedule.date,
  term: includeSchedule.term,
  createdAt: includeSchedule.createdAt,
});

module.exports = {
  createIncludeSchedule,
  getIncludeSchedules,
  getIncludeScheduleById,
  deleteIncludeScheduleById,
  updateIncludeSchedule,
  serializer,
};

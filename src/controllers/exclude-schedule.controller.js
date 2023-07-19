const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { excludeScheduleService } = require('../services');

const createExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.createExcludeSchedule(req.body);
  const result = excludeScheduleService.serializer(excludeSchedule);
  res.status(httpStatus.CREATED).send(result);
});

const getExcludeSchedules = catchAsync(async (req, res) => {
  const excludeSchedules = await excludeScheduleService.getExcludeSchedules(req.query.placeId);
  const result = excludeSchedules.map(excludeScheduleService.serializer);
  res.send(result);
});

const getExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.getExcludeScheduleById(req.params.excludeScheduleId);
  if (!excludeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  const result = excludeScheduleService.serializer(excludeSchedule);
  res.send(result);
});

const updateExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.updateExcludeSchedule(req.params.excludeScheduleId, req.body);
  const result = excludeScheduleService.serializer(excludeSchedule);
  res.send(result);
});

const deleteExcludeSchedule = catchAsync(async (req, res) => {
  await excludeScheduleService.deleteExcludeScheduleById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createExcludeSchedule,
  getExcludeSchedule,
  getExcludeSchedules,
  updateExcludeSchedule,
  deleteExcludeSchedule,
};

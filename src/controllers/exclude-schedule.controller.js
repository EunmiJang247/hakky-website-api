const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { excludeScheduleService } = require('../services');

const createExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.createExcludeSchedule(req.body);
  res.status(httpStatus.CREATED).send(excludeSchedule);
});

const getExcludeSchedules = catchAsync(async (req, res) => {
  const excludeSchedules = await excludeScheduleService.getExcludeSchedules(req.query.placeId);
  res.send(excludeSchedules);
});

const getExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.getExcludeScheduleById(req.params.excludeScheduleId);
  if (!excludeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(excludeSchedule);
});

const updateExcludeSchedule = catchAsync(async (req, res) => {
  const excludeSchedule = await excludeScheduleService.updateExcludeSchedule(req.params.excludeScheduleId, req.body);
  res.send(excludeSchedule);
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

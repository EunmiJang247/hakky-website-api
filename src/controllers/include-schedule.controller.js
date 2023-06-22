const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { includeScheduleService } = require('../services');

const createIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.createIncludeSchedule(req.body);
  res.status(httpStatus.CREATED).send(includeSchedule);
});

const getIncludeSchedules = catchAsync(async (req, res) => {
  const includeSchedules = await includeScheduleService.getIncludeSchedules(req.query.includeScheduleId);
  res.send(includeSchedules);
});

const getIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.getIncludeScheduleById(req.params.productId);
  if (!includeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(includeSchedule);
});

const updateIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.updateIncludeSchedule(req.params.includeScheduleId, req.body);
  res.send(includeSchedule);
});

const deleteIncludeSchedule = catchAsync(async (req, res) => {
  await includeScheduleService.deleteIncludeScheduleById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createIncludeSchedule,
  getIncludeSchedule,
  getIncludeSchedules,
  updateIncludeSchedule,
  deleteIncludeSchedule,
};

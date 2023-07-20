const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { includeScheduleService } = require('../services');

const createIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.createIncludeSchedule(req.body);
  const result = includeScheduleService.serializer(includeSchedule);
  res.status(httpStatus.CREATED).send(result);
});

const getIncludeSchedules = catchAsync(async (req, res) => {
  const includeSchedules = await includeScheduleService.getIncludeSchedules(req.query.placeId);
  const result = includeSchedules.map(includeScheduleService.serializer);
  res.send(result);
});

const getIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.getIncludeScheduleById(req.params.includeScheduleId);
  if (!includeSchedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  const result = includeScheduleService.serializer(includeSchedule);
  res.send(result);
});

const updateIncludeSchedule = catchAsync(async (req, res) => {
  const includeSchedule = await includeScheduleService.updateIncludeSchedule(req.params.includeScheduleId, req.body);
  const result = includeScheduleService.serializer(includeSchedule);
  res.send(result);
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

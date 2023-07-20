const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { scheduleService } = require('../services');

const createSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.createSchedule(req.body);
  res.status(httpStatus.CREATED).send(schedule);
});

const getSchedules = catchAsync(async (req, res) => {
  const schedules = await scheduleService.getSchedules(req.query.placeId);
  const result = schedules.map(scheduleService.serializer);
  res.send(result);
});

const getSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.getScheduleById(req.params.scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  const result = scheduleService.serializer(schedule);
  res.send(result);
});

const updateSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.updateSchedule(req.params.scheduleId, req.body);
  const result = scheduleService.serializer(schedule);
  res.send(result);
});

const deleteSchedule = catchAsync(async (req, res) => {
  await scheduleService.deleteScheduleById(req.params.scheduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};

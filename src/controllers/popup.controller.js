const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { popupService } = require('../services');

const createPopup = catchAsync(async (req, res) => {
  const user = await popupService.createPopup(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getPopups = catchAsync(async (req, res) => {
  const result = await popupService.queryPopups();
  res.send(result);
});

const getPopup = catchAsync(async (req, res) => {
  const user = await popupService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Popup not found');
  }
  res.send(user);
});

const updatePopup = catchAsync(async (req, res) => {
  const user = await popupService.updatePopupById(req.params.userId, req.body);
  res.send(user);
});

const deletePopup = catchAsync(async (req, res) => {
  await popupService.deletePopupById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPopup,
  getPopups,
  getPopup,
  updatePopup,
  deletePopup,
};

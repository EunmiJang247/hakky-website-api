const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { popupService } = require('../services');
const {preSignS3Object} = require("../utils/upload");

const createPopup = catchAsync(async (req, res) => {
  const user = await popupService.createPopup(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getPopups = catchAsync(async (req, res) => {
  const result = await popupService.queryPopups();
  res.send(result);
});

const getPopup = catchAsync(async (req, res) => {
  const popup = await popupService.getPopupById(req.params.popupId);
  if (!popup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Popup not found');
  }
  res.send({
    ...popup.toObject(),
    id: popup.id,
    image: {
      tempUrl: preSignS3Object(popup.image),
      key: popup.image,
    },
  });
});

const updatePopup = catchAsync(async (req, res) => {
  const user = await popupService.updatePopupById(req.params.popupId, req.body);
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

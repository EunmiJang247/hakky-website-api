const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { placeService } = require('../services');

const createPlace = catchAsync(async (req, res) => {
  const place = await placeService.createPlace(req.body);
  res.status(httpStatus.CREATED).send(place);
});

const getPlaces = catchAsync(async (req, res) => {
  const places = await placeService.getPlaces();
  res.send(places);
});

const getPlace = catchAsync(async (req, res) => {
  const user = await placeService.getPlaceById(req.params.noticeId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(user);
});

const updatePlace = catchAsync(async (req, res) => {
  const user = await placeService.updatePlace(req.params.placeId, req.body);
  res.send(user);
});

const deletePlace = catchAsync(async (req, res) => {
  await placeService.deletePlace(req.params.noticeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
  deletePlace,
};

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
  const place = await placeService.getPlaceById(req.params.placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  const result = await placeService.serializer(place);
  res.send(result);
});

const getPlaceDetail = catchAsync(async (req, res) => {
  const date = new Date(`${req.params.year}-${req.params.month}-${req.params.day}`);

  const place = await placeService.getPlaceDetail(req.params.placeId, date, req.params.dayOfWeek);
  if (place === 'CAN_NOT_RESERVATION') {
    throw new ApiError(httpStatus.BAD_REQUEST, '현재 예약을 받고있지 않은 기간입니다.');
  }
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'placd not found');
  }
  res.send(place);
});

const getPlaceReservationList = catchAsync(async (req, res) => {
  const date = new Date(`${req.params.year}-${req.params.month}-${req.params.day}`);

  const place = await placeService.getPlaceReservationList(req.params.placeId, date);
  if (place === 'CAN_NOT_RESERVATION') {
    throw new ApiError(httpStatus.BAD_REQUEST, '현재 예약을 받고있지 않은 기간입니다.');
  }
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'placd not found');
  }
  res.send(place);
});

const updatePlace = catchAsync(async (req, res) => {
  const place = await placeService.updatePlace(req.params.placeId, req.body);
  res.send(place);
});

const deletePlace = catchAsync(async (req, res) => {
  await placeService.deletePlaceById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
  deletePlace,
  getPlaceDetail,
  getPlaceReservationList,
};

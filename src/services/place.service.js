const httpStatus = require('http-status');
const { Place } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotice = async (noticeBody) => {
  return Place.create(noticeBody);
};

const queryPlaces = async () => {
  const places = await Place.find();
  return places;
};

const getPlaceById = async (id) => {
  const detailData = await Place.findById(id);
  return detailData;
};

const updatePlace = async (noticeId, updateBody) => {
  const place = await getPlaceById(noticeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  Object.assign(place, updateBody);
  await place.save();
  return place;
};

const deletePlaceById = async (noticeId) => {
  const place = await getPlaceById(noticeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  await place.remove();
  return place;
};

module.exports = {
  createNotice,
  queryPlaces,
  getPlaceById,
  deletePlaceById,
  updatePlace,
};

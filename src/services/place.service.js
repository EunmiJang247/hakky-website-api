const httpStatus = require('http-status');
const { Place } = require('../models');
const ApiError = require('../utils/ApiError');

const createPlace = async (placeBody) => {
  return Place.create(placeBody);
};

const getPlaces = async () => {
  const places = await Place.find();
  return places;
};

const getPlaceById = async (id) => {
  const detailData = await Place.findById(id);
  return detailData;
};

const updatePlace = async (placeId, updateBody) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'place not found');
  }
  Object.assign(place, updateBody);
  await place.save();
  return place;
};

const deletePlaceById = async (noticeId) => {
  const place = await getPlaceById(noticeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'place not found');
  }
  await place.remove();
  return place;
};

module.exports = {
  createPlace,
  getPlaces,
  getPlaceById,
  deletePlaceById,
  updatePlace,
};

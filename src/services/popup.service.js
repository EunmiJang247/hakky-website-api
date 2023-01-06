const httpStatus = require('http-status');
const { Popup } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a popup
 * @param {Object} popupBody
 * @returns {Promise<Popup>}
 */
const createPopup = async (popupBody) => {
  return Popup.create(popupBody);
};

/**
 * Query for popups
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPopups = async () => {
  const popups = await Popup.find();
  return popups;
};

/**
 * Get popup by id
 * @param {ObjectId} id
 * @returns {Promise<Popup>}
 */
const getPopupById = async (id) => {
  return Popup.findById(id);
};

/**
 * Update popup by id
 * @param {ObjectId} popupId
 * @param {Object} updateBody
 * @returns {Promise<Popup>}
 */
const updatePopupById = async (popupId, updateBody) => {
  const popup = await getPopupById(popupId);
  if (!popup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Popup not found');
  }
  Object.assign(popup, updateBody);
  await popup.save();
  return popup;
};

/**
 * Delete popup by id
 * @param {ObjectId} popupId
 * @returns {Promise<Popup>}
 */
const deletePopupById = async (popupId) => {
  const popup = await getPopupById(popupId);
  if (!popup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Popup not found');
  }
  await popup.remove();
  return popup;
};

module.exports = {
  createPopup,
  queryPopups,
  getPopupById,
  updatePopupById,
  deletePopupById,
};

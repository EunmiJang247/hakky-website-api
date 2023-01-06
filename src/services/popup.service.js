const httpStatus = require('http-status');
const { Popup } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createPopup = async (popupBody) => {
  return Popup.create(popupBody);
};

/**
 * Query for users
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
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getPopupById = async (id) => {
  return Popup.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
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
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deletePopupById = async (popupId) => {
  const popup = await getPopupById(popupId);
  if (!popup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
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

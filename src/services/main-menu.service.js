const httpStatus = require('http-status');
const { MainMenu } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryMainMenu = async () => {
  const mainMenus = await MainMenu.find();
  const menuArray = mainMenus[0].menus;
  return menuArray;
};

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateMainMenu = async (updateBody) => {
  const mainMenus = await MainMenu.findOne();
  if (!mainMenus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'mainMenu not found');
  }
  const updateInfo = { menus: updateBody };
  Object.assign(mainMenus, updateInfo);
  await mainMenus.save();
  return mainMenus;
};

module.exports = {
  queryMainMenu,
  updateMainMenu,
};

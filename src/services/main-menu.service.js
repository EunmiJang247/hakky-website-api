const httpStatus = require('http-status');
const {
  MainMenu, Division, League, Tournament,
} = require('../models');
const ApiError = require('../utils/ApiError');

const leagueSerializer = async (league) => {
  const divisionsFromServer = await Division.find({ leagueId: league.id });

  const divisions = divisionsFromServer.map((d) => ({ divisionName: d.name, divisionId: d.id }));
  const leagueFromServer = await League.findById(league.id);

  let tournamentId;
  if (leagueFromServer.leagueType === 'student' && divisionsFromServer.length > 0) {
    const tournamentFromServer = await Tournament.find({ divisionId: divisionsFromServer[0]._id });
    if (tournamentFromServer.length > 0) {
      tournamentId = tournamentFromServer[0].id;
    }
  }

  return {
    id: league.id,
    name: leagueFromServer.name,
    leagueType: leagueFromServer.leagueType,
    divisions,
    tournamentId,
  };
};

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryMainMenu = async () => {
  const mainMenus = await MainMenu.find();
  const menuArray = mainMenus[0].menus;
  // 리그의 디비전들을 돌려줌
  const result = await Promise.all(menuArray.map(leagueSerializer));
  return result;
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

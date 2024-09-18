const httpStatus = require('http-status');
const { League, MainMenu, Division } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a team
 * @param {Object} teamBody
 * @returns {Promise<Team>}
 */
const createLeague = async (teamBody) => League.create(teamBody);

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryLeagues = async ({ limit, skip }) => {
  const leagues = await League.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
  const count = await League.countDocuments();
  return {
    result: leagues,
    count,
  };
};

const queryRegulation = async (leagueId) => {
  const league = await League.findById(leagueId);
  const { regulation } = league;
  return regulation;
};

const queryActiveLeagues = async () => {
  const teams = await League.find({ active: 'Y' });
  return teams;
};

/**
 * Get faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */
const getLeagueById = async (id) => League.findById(id);

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateLeagueById = async (leagueId, updateBody) => {
  const league = await getLeagueById(leagueId);
  if (!league) {
    throw new ApiError(httpStatus.NOT_FOUND, 'league not found');
  }
  Object.assign(league, updateBody);
  await league.save();
  return league;
};

/**
 * Delete faq by id
 * @param {ObjectId} faqId
 * @returns {Promise<Faq>}
 */

const deleteLeagueById = async (leagueId) => {
  const league = await getLeagueById(leagueId);
  if (!league) {
    throw new ApiError(httpStatus.NOT_FOUND, 'League not found');
  }
  // 메인메뉴에 등록되어있다면 삭제 불가
  const mainMenus = await MainMenu.find();
  const menuCount = mainMenus[0].menus.reduce((acc, menu) => {
    if (menu.id === leagueId) {
      // eslint-disable-next-line no-param-reassign
      acc = 1;
    }
    return acc;
  }, 0);
  if (Number(menuCount) > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MainMenu Registered');
  }
  // 디비전에 등록되어있다면 삭제 불가
  const divisions = await Division.find({ leagueId });
  if (divisions.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division Registered');
  }
  await league.remove();
  return league;
};

module.exports = {
  createLeague,
  queryLeagues,
  queryRegulation,
  queryActiveLeagues,
  getLeagueById,
  updateLeagueById,
  deleteLeagueById,
};

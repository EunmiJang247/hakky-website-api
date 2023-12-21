const httpStatus = require('http-status');
const { League } = require('../models');
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
  const teams = await League.find().limit(limit).skip(skip);
  const count = await League.countDocuments();
  return {
    result: teams,
    count,
  };
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
  await league.remove();
  return league;
};

module.exports = {
  createLeague,
  queryLeagues,
  queryActiveLeagues,
  getLeagueById,
  updateLeagueById,
  deleteLeagueById,
};
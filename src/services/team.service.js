const httpStatus = require('http-status');
const { Team, Player, Division } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a team
 * @param {Object} teamBody
 * @returns {Promise<Team>}
 */
const createTeam = async (teamBody) => Team.create(teamBody);

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryTeams = async ({ limit, skip }) => {
  const teams = await Team.find().sort({ _id: -1 }).limit(limit).skip(skip);
  const count = await Team.countDocuments();
  return {
    result: teams,
    count,
  };
};

/**
 * Get faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */
const getTeamById = async (id) => Team.findById(id);

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateTeamById = async (teamId, updateBody) => {
  const team = await getTeamById(teamId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  Object.assign(team, updateBody);
  await team.save();
  return team;
};

/**
 * Delete faq by id
 * @param {ObjectId} teamId
 * @returns {Promise<Faq>}
 */

const deleteTeamById = async (teamId) => {
  const team = await getTeamById(teamId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  // 팀에 등록된 선수가 있을 시 삭제하지 못하게 해야함.
  const players = await Player.find({ teamId });
  if (players.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resist Player Exist');
  }
  // 팀이 디비전에 등록되어있다면 삭제하지 못하게 해야함.
  const divisions = await Division.find({ team: { $elemMatch: { id: teamId } } });
  if (divisions.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resist Division Exist');
  }
  // 팀이 등록된 경기가 있다면 삭제하지 못하게 해야함.

  await team.remove();
  return team;
};

const queryActiveTeams = async () => {
  const teams = await Team.find({ active: 'Y' });
  return teams;
};

module.exports = {
  createTeam,
  queryTeams,
  getTeamById,
  updateTeamById,
  deleteTeamById,
  queryActiveTeams,
};

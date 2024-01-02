const httpStatus = require('http-status');
const { Player, Tournament } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a team
 * @param {Object} playerBody
 * @returns {Promise<Team>}
 */
const createPlayer = async (playerBody) => Player.create(playerBody);

/**
 * Query for faqs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryPlayers = async ({ limit, skip }) => {
  const players = await Player.find().limit(limit).skip(skip).populate('teamId', 'name');
  const count = await Player.countDocuments();
  return {
    result: players,
    count,
  };
};

const queryPlayersByTeam = async ({ limit, skip, teamId }) => {
  const players = await Player.find({ teamId }).limit(limit).skip(skip);
  const count = await Player.find({ teamId }).countDocuments();
  return {
    result: players,
    count,
  };
};

const queryActivePlayersWithTeamId = async (teamId) => {
  const players = await Player.find({ teamId });
  return players;
};

/**
 * Get faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */
const getPlayerById = async (id) => Player.findById(id);

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updatePlayerById = async (playerId, updateBody) => {
  const player = await getPlayerById(playerId);
  if (!player) {
    throw new ApiError(httpStatus.NOT_FOUND, 'playerId not found');
  }
  Object.assign(player, updateBody);
  await player.save();
  return player;
};

/**
 * Delete faq by id
 * @param {ObjectId} faqId
 * @returns {Promise<Faq>}
 */

const deletePlayerById = async (playerId) => {
  const player = await getPlayerById(playerId);
  if (!player) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player not found');
  }
  // 등록되어있는 대회가 있으면 삭제 못함
  const tournament = await Tournament.find({ players: { $elemMatch: { playerId } } });
  if (tournament.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resist Tournament Exist');
  }
  await player.remove();
  return player;
};

module.exports = {
  createPlayer,
  queryPlayers,
  queryPlayersByTeam,
  queryActivePlayersWithTeamId,
  getPlayerById,
  updatePlayerById,
  deletePlayerById,
};

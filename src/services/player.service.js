const httpStatus = require('http-status');
const { Player } = require('../models');
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
  const players = await Player.find().limit(limit).skip(skip);
  const count = await Player.countDocuments();
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
  const team = await getPlayerById(playerId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player not found');
  }
  await team.remove();
  return team;
};

module.exports = {
  createPlayer,
  queryPlayers,
  queryActivePlayersWithTeamId,
  getPlayerById,
  updatePlayerById,
  deletePlayerById,
};

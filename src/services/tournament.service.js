// const httpStatus = require('http-status');
const { Tournament } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 * Create a tournament
 * @param {Object} tournamentBody
 * @returns {Promise<Tournament>}
 */
const createTournament = async (tournamentBody) => {
  Tournament.create(tournamentBody);
};

const queryTournaments = async ({ divisionId, limit, skip }) => {
  const tournaments = await Tournament.find({ divisionId }).limit(limit).skip(skip);
  const count = await Tournament.countDocuments();
  return {
    result: tournaments,
    count,
  };
};

// const queryTournamentsCalendar = async ({ startDate, endDate }) => {
//   const tournaments = await Tournament.find({ divisionId }).limit(limit).skip(skip);
//   const count = await Tournament.countDocuments();
//   return {
//     result: tournaments,
//     count,
//   };
// };

module.exports = {
  createTournament,
  queryTournaments,
  // queryTournamentsCalendar,
};

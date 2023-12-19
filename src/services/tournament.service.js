// const httpStatus = require('http-status');
const { Tournament, Team } = require('../models');
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

const calendarSerializer = async (tournament) => {
  const homeTeam = await Team.findById(tournament.homeTeamId);
  const awayTeam = await Team.findById(tournament.awayTeamId);

  return {
    id: tournament._id,
    tournamentDate: tournament.tournamentDate,
    awayTeamId: tournament.awayTeamId,
    homeTeamId: tournament.homeTeamId,
    referee: tournament.referee,
    supervisor: tournament.supervisor,
    time: tournament.time,
    venuePlace: tournament.venuePlace,
    divisionId: tournament.divisionId,
    createdAt: tournament.createdAt,
    updatedAt: tournament.updatedAt,
    homeTeamName: homeTeam.name,
    awayTeamName: awayTeam.name,
  };
};

const queryTournamentsCalendar = async ({ startDate, endDate }) => {
  const tournaments = await Tournament.find({
    tournamentDate: {
      $gt: startDate,
      $lt: endDate,
    },
  });
  const result = await Promise.all(tournaments.map(calendarSerializer));
  return result;
};

module.exports = {
  createTournament,
  queryTournaments,
  queryTournamentsCalendar,
};

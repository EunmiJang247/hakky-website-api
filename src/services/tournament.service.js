// const httpStatus = require('http-status');
const httpStatus = require('http-status');
const { Tournament, Team } = require('../models');
const ApiError = require('../utils/ApiError');
// const ApiError = require('../utils/ApiError');

/**
 * Create a tournament
 * @param {Object} tournamentBody
 * @returns {Promise<Tournament>}
 */
const createTournament = async (tournamentBody) => {
  Tournament.create(tournamentBody);
};

const tournamentSerializer = async (tournament) => {
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

const queryTournaments = async ({ divisionId }) => {
  const tournaments = await Tournament.find({ divisionId });
  const result = await Promise.all(tournaments.map(tournamentSerializer));
  const count = await Tournament.countDocuments();
  return {
    result,
    count,
  };
};

const getTournamentById = async (id) => Tournament.findById(id);

const updateTournamentById = async (tournamentId, updateBody) => {
  const tournament = await getTournamentById(tournamentId);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'playerId not found');
  }
  Object.assign(tournament, updateBody);
  await tournament.save();
  return tournament;
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
  getTournamentById,
  updateTournamentById,
  queryTournamentsCalendar,
};

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tournamentService } = require('../services');
// const ApiError = require('../utils/ApiError');

const createTournaments = catchAsync(async (req, res) => {
  const tournament = await tournamentService.createTournament(req.body);
  res.status(httpStatus.CREATED).send(tournament);
});

const getTournament = catchAsync(async (req, res) => {
  const result = await tournamentService.getTournamentById(req.params.tournamentId);
  res.send(result);
});

const updateTournament = catchAsync(async (req, res) => {
  const result = await tournamentService.updateTournamentById(req.params.tournamentId, req.body);
  res.send(result);
});

const getTournaments = catchAsync(async (req, res) => {
  const result = await tournamentService.queryTournaments({
    divisionId: req.query.divisionId,
  });
  res.send(result);
});

const getTournamentsCalendar = catchAsync(async (req, res) => {
  const result = await tournamentService.queryTournamentsCalendar({
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  });
  res.send(result);
});

const deleteTournament = catchAsync(async (req, res) => {
  await tournamentService.deleteTournamentById(req.params.tournamentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTournaments,
  getTournament,
  updateTournament,
  getTournaments,
  getTournamentsCalendar,
  deleteTournament,
};

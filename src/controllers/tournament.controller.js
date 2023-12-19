const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tournamentService } = require('../services');
// const ApiError = require('../utils/ApiError');

const createTournaments = catchAsync(async (req, res) => {
  const tournament = await tournamentService.createTournament(req.body);
  res.status(httpStatus.CREATED).send(tournament);
});

const getTournaments = catchAsync(async (req, res) => {
  const result = await tournamentService.queryTournaments({
    divisionId: req.query.divisionId,
    limit: req.query.limit,
    skip: req.query.skip,
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

module.exports = {
  createTournaments,
  getTournaments,
  getTournamentsCalendar,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { leagueService } = require('../services');

const createLeague = catchAsync(async (req, res) => {
  const team = await leagueService.createLeague(req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getLeagues = catchAsync(async (req, res) => {
  const result = await leagueService.queryLeagues({
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

const getActiveLeagues = catchAsync(async (req, res) => {
  const result = await leagueService.queryActiveLeagues();
  res.send(result);
});

const getLeague = catchAsync(async (req, res) => {
  const league = await leagueService.getLeagueById(req.params.leagueId);
  if (!league) {
    throw new ApiError(httpStatus.NOT_FOUND, 'League not found');
  }
  res.send(league);
});

const updateLeague = catchAsync(async (req, res) => {
  const team = await leagueService.updateLeagueById(req.params.leagueId, req.body);
  res.send(team);
});

const deleteLeague = catchAsync(async (req, res) => {
  await leagueService.deleteLeagueById(req.params.leagueId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLeague,
  getLeagues,
  getLeague,
  getActiveLeagues,
  updateLeague,
  deleteLeague,
};

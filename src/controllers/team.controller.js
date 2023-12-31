const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { teamService, divisionService, playerService } = require('../services');
const { League } = require('../models');

const createTeam = catchAsync(async (req, res) => {
  const team = await teamService.createTeam(req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getTeams = catchAsync(async (req, res) => {
  const result = await teamService.queryTeams({
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

const getTeam = catchAsync(async (req, res) => {
  const team = await teamService.getTeamById(req.params.teamId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  res.send(team);
});

const participatedDivisionsParser = async (participatedDivisions) => {
  const league = await League.findById(participatedDivisions.leagueId);
  const leagueName = league.name;
  const leagueYear = league.year;
  const result = {
    leagueName,
    leagueYear,
    leagueId: participatedDivisions.leagueId,
    name: participatedDivisions.name,
    teamScore: participatedDivisions.teamScore,
    playerScore: participatedDivisions.playerScore,
  };
  return result;
};

const getTeamYearlyScore = catchAsync(async (req, res) => {
  const participatedDivisions = await divisionService.getAllDivisionsWithTeamId(req.params.teamId);
  const result = await Promise.all(participatedDivisions.map(participatedDivisionsParser));
  res.send(result);
});

const getTeamPlayers = catchAsync(async (req, res) => {
  const players = await playerService.queryActivePlayersWithTeamId(req.params.teamId);
  res.send(players);
});

const updateTeam = catchAsync(async (req, res) => {
  const team = await teamService.updateTeamById(req.params.teamId, req.body);
  res.send(team);
});

const deleteTeam = catchAsync(async (req, res) => {
  await teamService.deleteTeamById(req.params.teamId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getActiveTeams = catchAsync(async (req, res) => {
  const result = await teamService.queryActiveTeams();
  res.send(result);
});

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  getTeamYearlyScore,
  getTeamPlayers,
  updateTeam,
  deleteTeam,
  getActiveTeams,
};

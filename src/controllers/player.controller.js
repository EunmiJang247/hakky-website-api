const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { playerService, teamService, divisionService } = require('../services');
const { League } = require('../models');

const createPlayer = catchAsync(async (req, res) => {
  const player = await playerService.createPlayer(req.body);
  res.status(httpStatus.CREATED).send(player);
});

const getPlayers = catchAsync(async (req, res) => {
  const result = await playerService.queryPlayers({
    limit: req.query.limit,
    skip: req.query.skip,
    searchParam: req.query.searchParam,
  });
  res.send(result);
});

const getAllActivePlayers = catchAsync(async (req, res) => {
  const result = await playerService.queryAllActivePlayers({
    keywords: req.query.keywords,
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

const getPlayersByTeam = catchAsync(async (req, res) => {
  const result = await playerService.queryPlayersByTeam({
    limit: req.query.limit,
    skip: req.query.skip,
    teamId: req.query.teamId,
  });
  res.send(result);
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
    playerScore: participatedDivisions.playerScore,
  };
  return result;
};

const getPlayerScore = catchAsync(async (req, res) => {
  const participatedDivisions = await divisionService.getAllDivisionsWithPlayer(req.params.playerId);
  const result = await Promise.all(participatedDivisions.map(participatedDivisionsParser));
  res.send(result);
});

const getPlayer = catchAsync(async (req, res) => {
  const player = await playerService.getPlayerById(req.params.playerId);
  const playerTeam = await teamService.getTeamById(player.teamId);
  if (!player) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  const result = {
    id: player._id,
    name: player.name,
    englishName: player.englishName,
    file: player.file,
    mainHand: player.mainHand,
    position: player.position,
    height: player.height,
    birth: player.birth,
    backNumber: player.backNumber,
    teamId: player.teamId,
    active: player.active,
    teamName: playerTeam.name,
  };
  res.send(result);
});

const updatePlayer = catchAsync(async (req, res) => {
  const team = await playerService.updatePlayerById(req.params.playerId, req.body);
  res.send(team);
});

const deletePlayer = catchAsync(async (req, res) => {
  await playerService.deletePlayerById(req.params.playerId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getActivePlayers = catchAsync(async (req, res) => {
  const result = await playerService.queryActivePlayersWithTeamId(req.query.teamId);
  res.send(result);
});

module.exports = {
  createPlayer,
  getPlayers,
  getAllActivePlayers,
  getPlayersByTeam,
  getPlayerScore,
  getPlayer,
  updatePlayer,
  deletePlayer,
  getActivePlayers,
};

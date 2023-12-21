const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { playerService } = require('../services');

const createPlayer = catchAsync(async (req, res) => {
  const player = await playerService.createPlayer(req.body);
  res.status(httpStatus.CREATED).send(player);
});

const getPlayers = catchAsync(async (req, res) => {
  const result = await playerService.queryPlayers({
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

const getPlayer = catchAsync(async (req, res) => {
  const team = await playerService.getPlayerById(req.params.playerId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  res.send(team);
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
  getPlayer,
  updatePlayer,
  deletePlayer,
  getActivePlayers,
};

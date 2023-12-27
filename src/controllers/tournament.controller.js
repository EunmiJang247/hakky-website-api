// const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tournamentService, divisionService } = require('../services');
const { Team, Player, Division } = require('../models');

const createTournaments = catchAsync(async (req, res) => {
  const { players, teams } = tournamentService.tournamentParse(req);

  await tournamentService.createTournament(req.body, players, teams);
  const division = await divisionService.getDivisionById(req.body.divisionId);
  const { playerScore, teamScore } = await divisionService.parseTournamentResult(req.body.divisionId);
  const divisionBeUpdatedTournament = {
    id: division.id,
    team: division.team,
    leagueId: division.leagueId,
    name: division.name,
    playerScore,
    teamScore,
  };
  await divisionService.updateDivisionById(req.body.divisionId, divisionBeUpdatedTournament);
  res.status(httpStatus.CREATED).send();
});

const teamNameShowParse = async (tournament) => {
  const homeTeam = await Team.findById(tournament.homeTeamId);
  const homeTeamName = homeTeam.name;
  const awayTeam = await Team.findById(tournament.awayTeamId);
  const awayTeamName = awayTeam.name;
  const optionsGoalsHome = await Promise.all(tournament.optionsGoalsHome.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goal) {
      const player = await Player.findById(option.goal);
      const playerName = player.name;
      optionCloned.goalPlayerName = playerName;
    }
    if (option.a1) {
      const player = await Player.findById(option.a1);
      const playerName = player.name;
      optionCloned.a1PlayerName = playerName;
    }
    if (option.a2) {
      const player = await Player.findById(option.a2);
      const playerName = player.name;
      optionCloned.a2PlayerName = playerName;
    }
    return optionCloned;
  }));
  const optionsGoalsAway = await Promise.all(tournament.optionsGoalsAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goal) {
      const player = await Player.findById(option.goal);
      const playerName = player.name;
      optionCloned.goalPlayerName = playerName;
    }
    if (option.a1) {
      const player = await Player.findById(option.a1);
      const playerName = player.name;
      optionCloned.a1PlayerName = playerName;
    }
    if (option.a2) {
      const player = await Player.findById(option.a2);
      const playerName = player.name;
      optionCloned.a2PlayerName = playerName;
    }
    return optionCloned;
  }));

  const optionsPlayersHome = await Promise.all(tournament.optionsPlayersHome.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.playerId) {
      const player = await Player.findById(option.playerId);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const optionsPlayersAway = await Promise.all(tournament.optionsPlayersAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.playerId) {
      const player = await Player.findById(option.playerId);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const optionPaneltiesHome = await Promise.all(tournament.optionPaneltiesHome.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.no) {
      const player = await Player.findById(option.no);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const optionPaneltiesAway = await Promise.all(tournament.optionPaneltiesAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.no) {
      const player = await Player.findById(option.no);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const optionGoalieSavesHome = await Promise.all(tournament.optionGoalieSavesHome.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goalie) {
      const player = await Player.findById(option.goalie);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const optionGoalieSavesAway = await Promise.all(tournament.optionGoalieSavesAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goalie) {
      const player = await Player.findById(option.goalie);
      const playerName = player.name;
      optionCloned.playerName = playerName;
    }
    return optionCloned;
  }));

  const result = {
    optionsGoalsHome,
    optionPaneltiesHome,
    optionGoalieSavesHome,
    optionsGoalsAway,
    optionPaneltiesAway,
    optionGoalieSavesAway,
    optionsPlayersHome,
    optionsPlayersAway,
    id: tournament._id,
    tournamentDate: tournament.tournamentDate,
    awayTeamId: tournament.awayTeamId,
    homeTeamId: tournament.homeTeamId,
    referee: tournament.referee,
    supervisor: tournament.supervisor,
    time: tournament.time,
    venuePlace: tournament.venuePlace,
    divisionId: tournament.divisionId,
    homeTeamName,
    awayTeamName,
  };
  return result;
};

const getTournament = catchAsync(async (req, res) => {
  const tournament = await tournamentService.getTournamentById(req.params.tournamentId);
  const result = await teamNameShowParse(tournament);
  res.send(result);
});

const updateTournament = catchAsync(async (req, res) => {
  const result = await tournamentService.updateTournamentById(req.params.tournamentId, req.body);
  const division = await divisionService.getDivisionById(req.body.divisionId);
  const { playerScore, teamScore } = await divisionService.parseTournamentResult(req.body.divisionId);
  const divisionBeUpdatedTournament = {
    id: division.id,
    team: division.team,
    leagueId: division.leagueId,
    name: division.name,
    playerScore,
    teamScore,
  };
  await divisionService.updateDivisionById(req.body.divisionId, divisionBeUpdatedTournament);
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
  const division = await Division.findById(req.query.divisionId);
  const { playerScore, teamScore } = await divisionService.parseTournamentResult(division.id);
  const divisionBeUpdatedTournament = {
    id: division.id,
    team: division.team,
    leagueId: division.leagueId,
    name: division.name,
    playerScore,
    teamScore,
  };
  await divisionService.updateDivisionById(req.query.divisionId, divisionBeUpdatedTournament);
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

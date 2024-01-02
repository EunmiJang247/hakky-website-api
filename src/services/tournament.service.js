// const httpStatus = require('http-status');
const httpStatus = require('http-status');
const _ = require('lodash');
const {
  Tournament, Team, Division, Player, League,
} = require('../models');
const ApiError = require('../utils/ApiError');
// const ApiError = require('../utils/ApiError');

/**
 * Create a tournament
 * @param {Object} tournamentBody
 * @returns {Promise<Tournament>}
 */
const createTournament = async (tournamentBody, players, teams) => {
  const tournament = Tournament.create({
    divisionId: tournamentBody.divisionId,
    tournamentDate: tournamentBody.tournamentDate,
    time: tournamentBody.time,
    supervisor: tournamentBody.supervisor,
    referee: tournamentBody.referee,
    homeTeamId: tournamentBody.homeTeamId,
    awayTeamId: tournamentBody.awayTeamId,
    optionsPlayersHome: tournamentBody.optionsPlayersHome,
    venuePlace: tournamentBody.venuePlace,
    optionsPlayersAway: tournamentBody.optionsPlayersAway,
    optionsGoalsHome: tournamentBody.optionsGoalsHome,
    optionPaneltiesHome: tournamentBody.optionPaneltiesHome,
    optionGoalieSavesHome: tournamentBody.optionGoalieSavesHome,
    optionsGoalsAway: tournamentBody.optionsGoalsAway,
    optionPaneltiesAway: tournamentBody.optionPaneltiesAway,
    optionGoalieSavesAway: tournamentBody.optionGoalieSavesAway,
    players,
    teams,
  });
  return tournament;
};

const tournamentsSerializer = async (tournament) => {
  const homeTeam = await Team.findById(tournament.homeTeamId);
  const awayTeam = await Team.findById(tournament.awayTeamId);
  const homeTeamGoalCount = tournament.teams[0].score.goal + (tournament.teams[0].score.otGoal ? tournament.teams[0].score.otGoal : 0);
  const awayTeamGoalCount = tournament.teams[1].score.goal + (tournament.teams[1].score.otGoal ? tournament.teams[1].score.otGoal : 0);
  const homeTeamLogo = homeTeam.file;
  const awayTeamLogo = awayTeam.file;

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
    teams: tournament.teams,
    players: tournament.players,
    homeTeamGoalCount,
    awayTeamGoalCount,
    homeTeamLogo,
    awayTeamLogo,
  };
};

const tournamentSerializer = async (tournament) => {
  const homeTeamGoalCount = tournament.teams[0].score.goal + (tournament.teams[0].score.otGoal ? tournament.teams[0].score.otGoal : 0);
  const awayTeamGoalCount = tournament.teams[1].score.goal + (tournament.teams[1].score.otGoal ? tournament.teams[1].score.otGoal : 0);
  const division = await Division.findById(tournament.divisionId);
  const divisionName = division.name;
  const league = await League.findById(division.leagueId);
  const { year } = league;
  const homeTeam = await Team.findById(tournament.homeTeamId);
  const homeTeamName = homeTeam.name;
  const awayTeam = await Team.findById(tournament.awayTeamId);
  const awayTeamName = awayTeam.name;
  const homeTeamLogo = homeTeam.file;
  const awayTeamLogo = awayTeam.file;
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
    divisionName,
    homeTeamName,
    awayTeamName,
    homeTeamGoalCount,
    awayTeamGoalCount,
    homeTeamLogo,
    awayTeamLogo,
    year,
  };
  return result;
};

const queryTournaments = async ({ divisionId }) => {
  const tournaments = await Tournament.find({ divisionId });
  const result = await Promise.all(tournaments.map(tournamentsSerializer));
  const count = await Tournament.countDocuments();
  return {
    result,
    count,
  };
};

const getTournamentById = async (id) => {
  const tournament = await Tournament.findById(id);
  const result = await tournamentSerializer(tournament);
  return result;
};

const updateTournamentById = async (tournamentId, updateBody, players, teams) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'playerId not found');
  }
  const updateTournament = {
    tournamentDate: updateBody.tournamentDate,
    awayTeamId: updateBody.awayTeamId,
    homeTeamId: updateBody.homeTeamId,
    referee: updateBody.referee,
    supervisor: updateBody.supervisor,
    time: updateBody.time,
    venuePlace: updateBody.venuePlace,
    divisionId: updateBody.divisionId,
    optionsPlayersHome: updateBody.optionsPlayersHome,
    optionsPlayersAway: updateBody.optionsPlayersAway,
    optionsGoalsHome: updateBody.optionsGoalsHome,
    optionPaneltiesHome: updateBody.optionPaneltiesHome,
    optionGoalieSavesHome: updateBody.optionGoalieSavesHome,
    optionsGoalsAway: updateBody.optionsGoalsAway,
    optionPaneltiesAway: updateBody.optionPaneltiesAway,
    optionGoalieSavesAway: updateBody.optionGoalieSavesAway,
    players,
    teams,
  };
  Object.assign(tournament, updateTournament);
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

const deleteTournamentById = async (tournamentId) => {
  const tournament = await Tournament.findById(tournamentId);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Player not found');
  }
  await tournament.remove();
  return tournament;
};

const tournamentParse = (req) => {
  const players = [];
  const teams = [];

  req.body.optionsPlayersHome.forEach((playerHome) => {
    const index = players.findIndex(((player) => player.playerId === playerHome.playerId));
    if (index === -1) {
      players.push({ playerId: playerHome.playerId, score: {} });
    }
  });

  req.body.optionsPlayersAway.forEach((playerHome) => {
    const index = players.findIndex(((player) => player.playerId === playerHome.playerId));
    if (index === -1) {
      players.push({ playerId: playerHome.playerId, score: {} });
    }
  });

  if (req.body.homeTeamId) {
    const index = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
    if (index === -1) {
      teams.push({ teamId: req.body.homeTeamId, score: { goal: 0 } });
    }
  }

  if (req.body.awayTeamId) {
    const index = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
    if (index === -1) {
      teams.push({ teamId: req.body.awayTeamId, score: { goal: 0 } });
    }
  }

  req.body.optionsGoalsHome.forEach((goalHome) => {
    if (goalHome.p === 'OT' && goalHome.goal !== undefined) {
      if (goalHome.goal) {
        const index = players.findIndex(((player) => player.playerId === goalHome.goal));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
        // 홈팀에서 골을 넣은 경우 어웨이 팀에 ga를 올리기.
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        if (index === -1) {
          players.push({ playerId: goalHome.goal, score: { goal: 1 } });
        } else {
          const goal = players[index].score.goal ? players[index].score.goal + 1 : 1;
          players[index].score.goal = goal;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { otGoal: 1 } });
        } else {
          const otGoalScroe = teams[indexTeam].score.otGoal ? teams[indexTeam].score.otGoal + 1 : 1;
          teams[indexTeam].score.otGoal = otGoalScroe;

          const goalsAgainstScore = teams[indexAwayTeam].score.goalsAgainst ? teams[indexAwayTeam].score.goalsAgainst + 1 : 1;
          teams[indexAwayTeam].score.goalsAgainst = goalsAgainstScore;
        }
      }
    } else {
      if (goalHome.goal) {
        const index = players.findIndex(((player) => player.playerId === goalHome.goal));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
        // 홈팀에서 골을 넣은 경우 어웨이 팀에 ga를 올리기.
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        if (index === -1) {
          players.push({ playerId: goalHome.goal, score: { goal: 1 } });
        } else {
          const goal = players[index].score.goal ? players[index].score.goal + 1 : 1;
          players[index].score.goal = goal;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { goal: 1 } });
        } else {
          const goalTeam = teams[indexTeam].score.goal ? teams[indexTeam].score.goal + 1 : 1;
          teams[indexTeam].score.goal = goalTeam;

          const goalsAgainstScore = teams[indexAwayTeam].score.goalsAgainst ? teams[indexAwayTeam].score.goalsAgainst + 1 : 1;
          teams[indexAwayTeam].score.goalsAgainst = goalsAgainstScore;
        }
      }
      if (goalHome.a1) {
        const index = players.findIndex(((player) => player.playerId === goalHome.a1));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        if (index === -1) {
          players.push({ playerId: goalHome.a1, score: { a1: 1 } });
        } else {
          const a1 = players[index].score.a1 ? players[index].score.a1 + 1 : 1;
          players[index].score.a1 = a1;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { a1: 1 } });
        } else {
          const goalTeam = teams[indexTeam].score.a1 ? teams[indexTeam].score.a1 + 1 : 1;
          teams[indexTeam].score.a1 = goalTeam;
        }
      }

      if (goalHome.a2) {
        const index = players.findIndex(((player) => player.playerId === goalHome.a2));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        if (index === -1) {
          players.push({ playerId: goalHome.a2, score: { a2: 1 } });
        } else {
          const a2 = players[index].score.a2 ? players[index].score.a2 + 1 : 1;
          players[index].score.a2 = a2;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { a2: 1 } });
        } else {
          const goalTeam = teams[indexTeam].score.a2 ? teams[indexTeam].score.a2 + 1 : 1;
          teams[indexTeam].score.a2 = goalTeam;
        }
      }
    }
  });

  req.body.optionsGoalsAway.forEach((goalAway) => {
    if (goalAway.p === 'OT' && goalAway.goal !== undefined) {
      if (goalAway.goal) {
        const index = players.findIndex(((player) => player.playerId === goalAway.goal));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
        // 홈팀에서 골을 넣은 경우 홈 팀에 ga를 올리기.
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        if (index === -1) {
          players.push({ playerId: goalAway.goal, score: { goal: 1 } });
        } else {
          const goal = players[index].score.goal ? players[index].score.goal + 1 : 1;
          players[index].score.goal = goal;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { otGoal: 1 } });
        } else {
          const otGoalScore = teams[indexTeam].score.otGoal ? teams[indexTeam].score.otGoal + 1 : 1;
          teams[indexTeam].score.otGoal = otGoalScore;

          const goalsAgainstScore = teams[indexHomeTeam].score.goalsAgainst ? teams[indexHomeTeam].score.goalsAgainst + 1 : 1;
          teams[indexHomeTeam].score.goalsAgainst = goalsAgainstScore;
        }
      }
    } else {
      if (goalAway.goal) {
        const index = players.findIndex(((player) => player.playerId === goalAway.goal));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
        // 홈팀에서 골을 넣은 경우 홈 팀에 ga를 올리기.
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        if (index === -1) {
          players.push({ playerId: goalAway.goal, score: { goal: 1 } });
        } else {
          const goal = players[index].score.goal ? players[index].score.goal + 1 : 1;
          players[index].score.goal = goal;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { goal: 1 } });
        } else {
          const goalsAgainstScore = teams[indexHomeTeam].score.goalsAgainst ? teams[indexHomeTeam].score.goalsAgainst + 1 : 1;
          const goalTeam = teams[indexTeam].score.goal ? teams[indexTeam].score.goal + 1 : 1;
          teams[indexTeam].score.goal = goalTeam;
          teams[indexHomeTeam].score.goalsAgainst = goalsAgainstScore;
        }
      }
      if (goalAway.a1) {
        const index = players.findIndex(((player) => player.playerId === goalAway.a1));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        if (index === -1) {
          players.push({ playerId: goalAway.a1, score: { a1: 1 } });
        } else {
          const a1 = players[index].score.a1 ? players[index].score.a1 + 1 : 1;
          players[index].score.a1 = a1;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { a1: 1 } });
        } else {
          const goalTeam = teams[indexTeam].score.a1 ? teams[indexTeam].score.a1 + 1 : 1;
          teams[indexTeam].score.a1 = goalTeam;
        }
      }

      if (goalAway.a2) {
        const index = players.findIndex(((player) => player.playerId === goalAway.a2));
        const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        if (index === -1) {
          players.push({ playerId: goalAway.a2, score: { a2: 1 } });
        } else {
          const a2 = players[index].score.a2 ? players[index].score.a2 + 1 : 1;
          players[index].score.a2 = a2;
        }

        if (indexTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { a2: 1 } });
        } else {
          const goalTeam = teams[indexTeam].score.a2 ? teams[indexTeam].score.a2 + 1 : 1;
          teams[indexTeam].score.a2 = goalTeam;
        }
      }
    }
  });

  req.body.optionPaneltiesHome.forEach((paneltyHome) => {
    if (paneltyHome.no) {
      const index = players.findIndex(((player) => player.playerId === paneltyHome.no));
      const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

      if (index === -1) {
        players.push({ playerId: paneltyHome.no, score: { penaltyMin: Number(paneltyHome.min), penaltyCount: 1 } });
      } else {
        const penaltyMin = players[index].score.penaltyMin ? Number(players[index].score.penaltyMin) + Number(paneltyHome.min) : Number(paneltyHome.min);
        const penaltyCount = players[index].score.penaltyCount ? Number(players[index].score.penaltyCount) + 1 : 1;
        players[index].score.penaltyMin = penaltyMin;
        players[index].score.penaltyCount = penaltyCount;
      }

      if (indexTeam === -1) {
        teams.push({ teamId: req.body.homeTeamId, score: { penaltyMin: Number(paneltyHome.min) } });
      } else {
        const penaltyMin = teams[indexTeam].score.penaltyMin ? Number(teams[indexTeam].score.penaltyMin) + Number(paneltyHome.min) : Number(paneltyHome.min);
        const penaltyCount = teams[indexTeam].score.penaltyCount ? Number(teams[indexTeam].score.penaltyCount) + 1 : 1;
        teams[indexTeam].score.penaltyMin = penaltyMin;
        teams[indexTeam].score.penaltyCount = penaltyCount;
      }
    }
  });

  req.body.optionPaneltiesAway.forEach((paneltyAway) => {
    if (paneltyAway.no) {
      const index = players.findIndex(((player) => player.playerId === paneltyAway.no));
      const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

      if (index === -1) {
        players.push({ playerId: paneltyAway.no, score: { penaltyMin: Number(paneltyAway.min), penaltyCount: 1 } });
      } else {
        const penaltyMin = players[index].score.penaltyMin ? Number(players[index].score.penaltyMin) + Number(paneltyAway.min) : Number(paneltyAway.min);
        const penaltyCount = players[index].score.penaltyCount ? Number(players[index].score.penaltyCount) + 1 : 1;
        players[index].score.penaltyMin = penaltyMin;
        players[index].score.penaltyCount = penaltyCount;
      }

      if (indexTeam === -1) {
        teams.push({ teamId: req.body.awayTeamId, score: { penaltyMin: Number(paneltyAway.min), penaltyCount: 1 } });
      } else {
        const penaltyMin = teams[indexTeam].score.penaltyMin ? Number(teams[indexTeam].score.penaltyMin) + Number(paneltyAway.min) : Number(paneltyAway.min);
        const penaltyCount = teams[indexTeam].score.penaltyCount ? Number(teams[indexTeam].score.penaltyCount) + 1 : 1;
        teams[indexTeam].score.penaltyMin = penaltyMin;
        teams[indexTeam].score.penaltyCount = penaltyCount;
      }
    }
  });

  req.body.optionGoalieSavesHome.forEach((goalieHome) => {
    if (goalieHome.goalie) {
      const index = players.findIndex(((player) => player.playerId === goalieHome.goalie));
      const indexTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

      if (index === -1) {
        players.push({ playerId: goalieHome.goalie, score: { goalsBlocked: Number(goalieHome.total), goalsAccepted: Number(goalieHome.acceptGoal), runningTime: Number(goalieHome.runningTime) } });
      } else {
        const goalsBlocked = players[index].score.goalsBlocked ? Number(players[index].score.goalsBlocked) + Number(goalieHome.total) : Number(goalieHome.total);
        const goalsAccepted = players[index].score.goalsAccepted ? Number(players[index].score.goalsAccepted) + Number(goalieHome.acceptGoal) : Number(goalieHome.acceptGoal);
        const runningTime = players[index].score.runningTime ? Number(players[index].score.runningTime) + Number(goalieHome.runningTime) : Number(goalieHome.runningTime);
        players[index].score.goalsBlocked = goalsBlocked;
        players[index].score.goalsAccepted = goalsAccepted;
        players[index].score.runningTime = runningTime;
      }

      if (indexTeam === -1) {
        teams.push({ teamId: req.body.homeTeamId, score: { goalsBlocked: Number(goalieHome.total), goalsAccepted: Number(goalieHome.acceptGoal) } });
      } else {
        const goalsBlockedTeam = teams[indexTeam].score.goalsBlocked ? Number(teams[indexTeam].score.goalsBlocked) + Number(goalieHome.total) : Number(goalieHome.total);
        const goalsAccepted = teams[indexTeam].score.goalsAccepted ? Number(teams[indexTeam].score.goalsAccepted) + Number(goalieHome.acceptGoal) : Number(goalieHome.acceptGoal);
        teams[indexTeam].score.goalsBlocked = goalsBlockedTeam;
        teams[indexTeam].score.goalsAccepted = goalsAccepted;
      }
    }
  });

  req.body.optionGoalieSavesAway.forEach((goalieAway) => {
    if (goalieAway.goalie) {
      const index = players.findIndex(((player) => player.playerId === goalieAway.goalie));
      const indexTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

      if (index === -1) {
        players.push({ playerId: goalieAway.goalie, score: { goalsBlocked: Number(goalieAway.total), goalsAccepted: Number(goalieAway.acceptGoal), runningTime: Number(goalieAway.runningTime) } });
      } else {
        const goalsBlocked = players[index].score.goalsBlocked ? Number(players[index].score.goalsBlocked) + Number(goalieAway.total) : Number(goalieAway.total);
        const goalsAccepted = players[index].score.goalsAccepted ? Number(players[index].score.goalsAccepted) + Number(goalieAway.acceptGoal) : Number(goalieAway.acceptGoal);
        const runningTime = players[index].score.runningTime ? Number(players[index].score.runningTime) + Number(goalieAway.runningTime) : Number(goalieAway.runningTime);
        players[index].score.goalsBlocked = goalsBlocked;
        players[index].score.goalsAccepted = goalsAccepted;
        players[index].score.runningTime = runningTime;
      }

      if (indexTeam === -1) {
        teams.push({ teamId: req.body.awayTeamId, score: { goalsBlocked: Number(goalieAway.total), goalsAccepted: Number(goalieAway.acceptGoal) } });
      } else {
        const goalsBlockedTeam = teams[indexTeam].score.goalsBlocked ? Number(teams[indexTeam].score.goalsBlocked) + Number(goalieAway.total) : Number(goalieAway.total);
        const goalsAccepted = teams[indexTeam].score.goalsAccepted ? Number(teams[indexTeam].score.goalsAccepted) + Number(goalieAway.acceptGoal) : Number(goalieAway.acceptGoal);
        teams[indexTeam].score.goalsBlocked = goalsBlockedTeam;
        teams[indexTeam].score.goalsAccepted = goalsAccepted;
      }
    }
  });
  return { players, teams };
};

module.exports = {
  createTournament,
  queryTournaments,
  getTournamentById,
  updateTournamentById,
  queryTournamentsCalendar,
  deleteTournamentById,
  tournamentParse,
};

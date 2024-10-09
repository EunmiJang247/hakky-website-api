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
      optionCloned.goalPlayerImage = player.file.tempUrl;
    }
    if (option.a1) {
      const player = await Player.findById(option.a1);
      const playerName = player.name;
      optionCloned.a1PlayerName = playerName;
      optionCloned.a1PlayerImage = player.file.tempUrl;
    }
    if (option.a2) {
      const player = await Player.findById(option.a2);
      const playerName = player.name;
      optionCloned.a2PlayerName = playerName;
      optionCloned.a2PlayerImage = player.file.tempUrl;
    }
    return optionCloned;
  }));
  const optionsGoalsAway = await Promise.all(tournament.optionsGoalsAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goal) {
      const player = await Player.findById(option.goal);
      const playerName = player.name;
      optionCloned.goalPlayerName = playerName;
      optionCloned.goalPlayerImage = player.file.tempUrl;
    }
    if (option.a1) {
      const player = await Player.findById(option.a1);
      const playerName = player.name;
      optionCloned.a1PlayerName = playerName;
      optionCloned.a1PlayerImage = player.file.tempUrl;
    }
    if (option.a2) {
      const player = await Player.findById(option.a2);
      const playerName = player.name;
      optionCloned.a2PlayerName = playerName;
      optionCloned.a2PlayerImage = player.file.tempUrl;
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
      optionCloned.playerImage = player.file.tempUrl;
    }
    return optionCloned;
  }));

  const optionPaneltiesAway = await Promise.all(tournament.optionPaneltiesAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.no) {
      const player = await Player.findById(option.no);
      const playerName = player.name;
      optionCloned.playerName = playerName;
      optionCloned.playerImage = player.file.tempUrl;
    }
    return optionCloned;
  }));

  const optionGoalieSavesHome = await Promise.all(tournament.optionGoalieSavesHome.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goalie) {
      const player = await Player.findById(option.goalie);
      const playerName = player.name;
      optionCloned.playerName = playerName;
      optionCloned.playerImage = player.file.tempUrl;
    }
    return optionCloned;
  }));

  const optionGoalieSavesAway = await Promise.all(tournament.optionGoalieSavesAway.map(async (option) => {
    const optionCloned = _.cloneDeep(option);
    if (option.goalie) {
      const player = await Player.findById(option.goalie);
      const playerName = player.name;
      optionCloned.playerName = playerName;
      optionCloned.playerImage = player.file.tempUrl;
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
  const players = []; // 선수들의 점수를 기록할 배열
  const teams = []; // 팀들의 점수를 기록할 배열

  // 홈팀의 선수 정보를 가져옴
  req.body.optionsPlayersHome.forEach((playerHome) => {
    const index = players.findIndex(((player) => player.playerId === playerHome.id));
    if (index === -1) {
      // 기존에 기록된 선수가 없으면 새로운 선수 추가, 초기 골 값 0
      players.push({ playerId: playerHome.id, score: { goal: 0 } });
    }
  });
  // 어웨이팀의 선수 정보를 가져옴
  req.body.optionsPlayersAway.forEach((playerAway) => {
    const index = players.findIndex(((player) => player.playerId === playerAway.id));
    if (index === -1) {
      // 기존에 기록된 선수가 없으면 새로운 선수 추가, 초기 골 값 0
      players.push({ playerId: playerAway.id, score: { goal: 0 } });
    }
  });
  // 홈팀의 팀 정보
  if (req.body.homeTeamId) {
    const index = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
    if (index === -1) {
      // 팀이 기록되지 않았다면 새로운 팀을 추가, 초기 골 값 0
      teams.push({ teamId: req.body.homeTeamId, score: { goal: 0 } });
    }
  }
  // 어웨이팀의 팀 정보
  if (req.body.awayTeamId) {
    const index = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
    if (index === -1) {
      // 팀이 기록되지 않았다면 새로운 팀을 추가, 초기 골 값 0
      teams.push({ teamId: req.body.awayTeamId, score: { goal: 0 } });
    }
  }
  // !! 홈팀의 골 기록을 처리
  req.body.optionsGoalsHome.forEach((goalHome) => {
    // 연장전 골(OT) 처리
    // console.log(req.body.optionsGoalsHome)는 아래와 같음.
    // {
    //   p: 'P1',
    //   time: '',
    //   goal: '659593adc55396557e81e28e',
    //   a1: '',
    //   a2: ''
    // }
    if (goalHome.p === 'OT' && goalHome.goal !== undefined) {
      if (goalHome.goal) {
        const indexplayer = players.findIndex(((player) => player.playerId === goalHome.goal));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        // 골을 넣은 선수의 골에 1추가
        players[indexplayer].score.goal = players[indexplayer].score.goal ? players[indexplayer].score.goal + 1 : 1;

        // 홈팀의 연장전 골 기록
        if (indexHomeTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { otGoal: 1 } });
        } else {
          teams[indexHomeTeam].score.otGoal = teams[indexHomeTeam].score.otGoal ? teams[indexHomeTeam].score.otGoal + 1 : 1;

          // 홈팀이 골을 넣었을 경우 어웨이팀의 실점(goalsAgainst)을 기록
          if (indexAwayTeam !== -1) {
            teams[indexAwayTeam].score.goalsAgainst = teams[indexAwayTeam].score.goalsAgainst ? teams[indexAwayTeam].score.goalsAgainst + 1 : 1;
          }
        }
      }
    } else {
      // 연장전에 넣은 골이 아닐 때
      if (goalHome.goal) {
        const indexPlayer = players.findIndex(((player) => player.playerId === goalHome.goal));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        // 선수의 goal스코어에 1을 더함
        players[indexPlayer].score.goal = players[indexPlayer].score.goal ? players[indexPlayer].score.goal + 1 : 1;

        if (indexHomeTeam === -1) {
          // 홈팀이 등록되어있지 않으면 등록하고 goal에 1을 넣음
          teams.push({ teamId: req.body.homeTeamId, score: { goal: 1 } });
        } else {
          // 등록되어있으면 goal에 1을 더함
          teams[indexHomeTeam].score.goal = teams[indexHomeTeam].score.goal ? teams[indexHomeTeam].score.goal + 1 : 1;

          if (indexAwayTeam !== -1) {
            // 어웨이 팀에는 먹힌골(goalsAgainst)에 1을 더함
            teams[indexAwayTeam].score.goalsAgainst = teams[indexAwayTeam].score.goalsAgainst ? teams[indexAwayTeam].score.goalsAgainst + 1 : 1;
          }
        }
      }
      if (goalHome.a1) {
        // 어시스트 a1이 있으면
        const indexPlayer = players.findIndex(((player) => player.playerId === goalHome.a1));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        // 선수의 a1에 1점을 올림
        players[indexPlayer].score.a1 = players[indexPlayer].score.a1 ? players[indexPlayer].score.a1 + 1 : 1;

        // 홈팀에 a1스코어를 1점을 올림
        if (indexHomeTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { a1: 1 } });
        } else {
          teams[indexHomeTeam].score.a1 = teams[indexHomeTeam].score.a1 ? teams[indexHomeTeam].score.a1 + 1 : 1;
        }
      }

      if (goalHome.a2) {
        // a2가 있을 때
        const indexPlayer = players.findIndex(((player) => player.playerId === goalHome.a2));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        players[indexPlayer].score.a2 = players[indexPlayer].score.a2 ? players[indexPlayer].score.a2 + 1 : 1;

        // 선수의 a2에 1점을 올림
        if (indexHomeTeam === -1) {
          teams.push({ teamId: req.body.homeTeamId, score: { a2: 1 } });
        } else {
          // 홈팀의 a2를 늘림
          teams[indexHomeTeam].score.a2 = teams[indexHomeTeam].score.a2 ? teams[indexHomeTeam].score.a2 + 1 : 1;
        }
      }
    }
  });

  // 어웨이 팀의 골을 계산하는 경우
  req.body.optionsGoalsAway.forEach((goalAway) => {
    if (goalAway.p === 'OT' && goalAway.goal !== undefined) {
    // 연장전 골(OT) 처리
    // console.log(req.body.optionsGoalsHome)는 아래와 같음.
    // {
    //   p: 'P1',
    //   time: '',
    //   goal: '659593adc55396557e81e28e',
    //   a1: '',
    //   a2: ''
    // }
      if (goalAway.goal) {
        // 어웨이 팀이 골을 득점하면
        const indexPlayer = players.findIndex(((player) => player.playerId === goalAway.goal));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        players[indexPlayer].score.goal = players[indexPlayer].score.goal ? players[indexPlayer].score.goal + 1 : 1;

        if (indexAwayTeam === -1) {
          // 어웨이 팀이 등록안되어 있으면 otGoal에 1일 넣고
          teams.push({ teamId: req.body.awayTeamId, score: { otGoal: 1 } });
        } else {
          // 등록이 되어있으면 otGoal에 1을 추가한다
          teams[indexAwayTeam].score.otGoal = teams[indexAwayTeam].score.otGoal ? teams[indexAwayTeam].score.otGoal + 1 : 1;

          if (indexHomeTeam !== -1) {
            // 홈팀에는 goalsAgainst에 1을 추가한다
            teams[indexHomeTeam].score.goalsAgainst = teams[indexHomeTeam].score.goalsAgainst ? teams[indexHomeTeam].score.goalsAgainst + 1 : 1;
          }
        }
      }
    } else {
      // 연장전 골이 아니면
      if (goalAway.goal) {
        const indexPlayer = players.findIndex(((player) => player.playerId === goalAway.goal));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));
        const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

        // 플레이어에게 goal + 1을 함
        players[indexPlayer].score.goal = players[indexPlayer].score.goal ? players[indexPlayer].score.goal + 1 : 1;

        if (indexAwayTeam === -1) {
          // 어웨이 팀이 없으면 배열에 추가해주고
          teams.push({ teamId: req.body.awayTeamId, score: { goal: 1 } });
        } else {
          // 어웨이 팀 배열이 있으면 어웨이 팀 goal에 1을 추가
          teams[indexAwayTeam].score.goal = teams[indexAwayTeam].score.goal ? teams[indexAwayTeam].score.goal + 1 : 1;

          if (indexHomeTeam !== -1) {
            // 홈팀에는 goalsAgainst을 1 추가한다
            teams[indexHomeTeam].score.goalsAgainst = teams[indexHomeTeam].score.goalsAgainst ? teams[indexHomeTeam].score.goalsAgainst + 1 : 1;
          }
        }
      }
      if (goalAway.a1) {
        // 어웨이팀 a1이 있으면
        const indexPlayer = players.findIndex(((player) => player.playerId === goalAway.a1));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        // 선수에 a1을 추가
        players[indexPlayer].score.a1 = players[indexPlayer].score.a1 ? players[indexPlayer].score.a1 + 1 : 1;

        if (indexAwayTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { a1: 1 } });
        } else {
          teams[indexAwayTeam].score.a1 = teams[indexAwayTeam].score.a1 ? teams[indexAwayTeam].score.a1 + 1 : 1;
        }
      }

      if (goalAway.a2) {
        // 어웨이팀 a2발생한 경우
        const indexPlayer = players.findIndex(((player) => player.playerId === goalAway.a2));
        const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

        players[indexPlayer].score.a2 = players[indexPlayer].score.a2 ? players[indexPlayer].score.a2 + 1 : 1;

        if (indexAwayTeam === -1) {
          teams.push({ teamId: req.body.awayTeamId, score: { a2: 1 } });
        } else {
          teams[indexAwayTeam].score.a2 = teams[indexAwayTeam].score.a2 ? teams[indexAwayTeam].score.a2 + 1 : 1;
        }
      }
    }
  });

  req.body.optionPaneltiesHome.forEach((paneltyHome) => {
    // 홈팀의 패널티가 발생한 경우
    if (paneltyHome.no) {
      const indexPlayer = players.findIndex(((player) => player.playerId === paneltyHome.no));
      const indexHomeTeam = teams.findIndex(((team) => team.teamId === req.body.homeTeamId));

      // 선수에 penaltyMin과 penaltyCount을 추가한다
      players[indexPlayer].score.penaltyMin = players[indexPlayer].score.penaltyMin ? Number(players[indexPlayer].score.penaltyMin) + Number(paneltyHome.min) : Number(paneltyHome.min);
      players[indexPlayer].score.penaltyCount = players[indexPlayer].score.penaltyCount ? Number(players[indexPlayer].score.penaltyCount) + 1 : 1;

      if (indexHomeTeam === -1) {
        teams.push({ teamId: req.body.homeTeamId, score: { penaltyMin: Number(paneltyHome.min) } });
      } else {
        // 홈 팀에 penaltyMin와 penaltyCount을 추가한다
        teams[indexHomeTeam].score.penaltyMin = teams[indexHomeTeam].score.penaltyMin ? Number(teams[indexHomeTeam].score.penaltyMin) + Number(paneltyHome.min) : Number(paneltyHome.min);
        teams[indexHomeTeam].score.penaltyCount = teams[indexHomeTeam].score.penaltyCount ? Number(teams[indexHomeTeam].score.penaltyCount) + 1 : 1;
      }
    }
  });

  req.body.optionPaneltiesAway.forEach((paneltyAway) => {
    // 어웨이 팀에 패널티가 발생한 경우
    if (paneltyAway.no) {
      const indexPlayer = players.findIndex(((player) => player.playerId === paneltyAway.no));
      const indexAwayTeam = teams.findIndex(((team) => team.teamId === req.body.awayTeamId));

      // 플레이어에 penaltyMin, penaltyCount를 더함.
      players[indexPlayer].score.penaltyMin = players[indexPlayer].score.penaltyMin ? Number(players[indexPlayer].score.penaltyMin) + Number(paneltyAway.min) : Number(paneltyAway.min);
      players[indexPlayer].score.penaltyCount = players[indexPlayer].score.penaltyCount ? Number(players[indexPlayer].score.penaltyCount) + 1 : 1;

      if (indexAwayTeam === -1) {
        teams.push({ teamId: req.body.awayTeamId, score: { penaltyMin: Number(paneltyAway.min), penaltyCount: 1 } });
      } else {
        teams[indexAwayTeam].score.penaltyMin = teams[indexAwayTeam].score.penaltyMin ? Number(teams[indexAwayTeam].score.penaltyMin) + Number(paneltyAway.min) : Number(paneltyAway.min);
        teams[indexAwayTeam].score.penaltyCount = teams[indexAwayTeam].score.penaltyCount ? Number(teams[indexAwayTeam].score.penaltyCount) + 1 : 1;
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

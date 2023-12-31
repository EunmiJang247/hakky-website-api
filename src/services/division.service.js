const httpStatus = require('http-status');
const {
  Division,
  League,
  Tournament,
  Team,
  Player,
} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a team
 * @param {Object} teamBody
 * @returns {Promise<Team>}
 */
const createDivision = async (teamBody) => Division.create(teamBody);

const divisionSerializer = async (division) => {
  const leagueInfo = await League.findById(division.leagueId);
  const participateTeam = await Promise.all(division.team.map(async (t) => {
    const team = await Team.findById(t.id);
    const teamName = team.name;
    return { id: t.id, name: teamName };
  }));
  const teamScoreResult = await Promise.all(division.teamScore.map(async (t) => {
    const team = await Team.findById(t.teamId);
    const teamLogo = team.file.tempUrl;
    const teamName = team.name;
    return {
      teamId: t.teamId, teamName, score: t.score, teamLogo,
    };
  }));
  const playerScoreResult = await Promise.all(division.playerScore.map(async (t) => {
    if (t.playerId) {
      const player = await Player.findById(t.playerId);
      const playerName = player.name;
      const { position } = player;
      const teamFromServer = await Team.findById(player.teamId);
      const playerTeamName = teamFromServer.name;
      const playerImage = player.file.tempUrl;
      return {
        playerId: t.playerId, playerName, position, score: t.score, playerTeamName, playerImage,
      };
    }
  }));

  return {
    id: division._id,
    team: participateTeam,
    leagueId: division.leagueId,
    leagueName: leagueInfo.name,
    name: division.name,
    teamScore: teamScoreResult,
    playerScore: playerScoreResult,
  };
};

const queryDivisions = async ({ limit, skip }) => {
  const divisions = await Division.find().limit(limit).skip(skip);
  const count = await Division.countDocuments();
  const result = await Promise.all(divisions.map(divisionSerializer));
  return {
    result,
    count,
  };
};

/**
 * Get faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */

const getDivisionById = async (id) => {
  const division = await Division.findById(id);
  const result = await divisionSerializer(division);
  return result;
};

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateDivisionById = async (divisionId, updateBody) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division not found');
  }
  Object.assign(division, updateBody);
  await division.save();
  return division;
};

/**
 * Delete faq by id
 * @param {ObjectId} divisionId
 * @returns {Promise<Faq>}
 */

const deleteDivisionById = async (divisionId) => {
  const division = await Division.findById(divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'division not found');
  }
  const tournaments = await Tournament.find({ divisionId });
  if (tournaments.length > 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RegistTournamentExist');
  }
  await division.remove();
  return division;
};

const parseTournamentResult = async (divisionId) => {
  // divisionId로 모든 tournament들을 검색.
  const tournaments = await Tournament.find({ divisionId });
  if (!tournaments) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournaments not found');
  }

  const playerScore = [];
  const teamScore = [];

  for (let i = 0; i < tournaments.length; i += 1) { // 모든 경기들을 순환함.
    const { players, teams } = tournaments[i];

    let goalsCount = 0;
    for (let j = 0; j < teams.length; j += 1) {
      if (teams[j].score.goal > 0) {
        goalsCount += 1;
      }
    }

    let otGoalCout = 0;
    for (let k = 0; k < teams.length; k += 1) {
      if (teams[k].score.otGoal > 0) {
        otGoalCout += 1;
      }
    }
    if (goalsCount === 0 && otGoalCout === 0) {
      teams.forEach((team) => {
        const index = teamScore.findIndex(((score) => score.teamId === team.teamId));
        if (index === -1) {
          teamScore.push({ teamId: team.teamId, score: { GP: 0 } });
        } else {
          const gamesPlayed = teamScore[index].score.GP ? Number(teamScore[index].score.GP) : 0;
          teamScore[index].score.GP = gamesPlayed;
        }
      });

      players.forEach((playerRecord) => {
        const indexPlayer = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (indexPlayer === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { GP: 0 } });
        } else {
          const gamesPlayed = playerScore[indexPlayer].score.GP ? Number(playerScore[indexPlayer].score.GP) : 0;
          playerScore[indexPlayer].score.GP = gamesPlayed;
        }
      });
    }
    if (goalsCount !== 0 || (goalsCount === 0 && otGoalCout !== 0)) {
      // GP player 골이 발생한 경우 GP를 올려준다.
      players.forEach((playerRecord) => {
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { GP: 1 } });
        } else {
          const gamesPlayed = playerScore[index].score.GP ? Number(playerScore[index].score.GP) + 1 : 1;
          playerScore[index].score.GP = gamesPlayed;
        }
      });

      // player records
      players.forEach((playerRecord) => {
        // 선수의 골이 있는 경우 | G, PTS
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));

        if (playerRecord.score.goal) {
          const goal = playerScore[index].score.G ? Number(playerScore[index].score.G) + playerRecord.score.goal : playerRecord.score.goal;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.goal : playerRecord.score.goal;
          playerScore[index].score.G = goal;
          playerScore[index].score.PTS = pts;
        }

        // A1, PTS
        if (playerRecord.score.a1) {
          // 선수의 a1이 있는 경우
          const assist = playerScore[index].score.A ? Number(playerScore[index].score.A) + playerRecord.score.a1 : playerRecord.score.a1;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.a1 : playerRecord.score.a1;
          playerScore[index].score.A = assist;
          playerScore[index].score.PTS = pts;
        }

        // A2, PTS
        if (playerRecord.score.a2) {
          // 선수의 a2이 있는 경우
          const assist = playerScore[index].score.A ? Number(playerScore[index].score.A) + playerRecord.score.a2 : playerRecord.score.a2;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.a2 : playerRecord.score.a2;
          playerScore[index].score.A = assist;
          playerScore[index].score.PTS = pts;
        }

        // PIM
        if (playerRecord.score ? playerRecord.score.penaltyMin : false) {
          const pim = playerScore[index].score.PIM ? Number(playerScore[index].score.PIM) + playerRecord.score.penaltyMin : playerRecord.score.penaltyMin;
          playerScore[index].score.PIM = pim;
        }

        // P
        if (playerRecord.score.penaltyCount) {
          const p = playerScore[index].score.P ? Number(playerScore[index].score.P) + playerRecord.score.penaltyCount : playerRecord.score.penaltyCount;
          playerScore[index].score.P = p;
        }

        // SA
        if (playerRecord.score.goalsBlocked) {
          // 선수의 goalsBlocked 이 있는 경우
          const sa = playerScore[index].score.SA ? Number(playerScore[index].score.SA) + playerRecord.score.goalsBlocked : playerRecord.score.goalsBlocked;
          playerScore[index].score.SA = sa;
        }

        // GA, SV, SV%
        if (playerRecord.score.goalsAccepted) {
          // 선수의 goalsAccepted 이 있는 경우
          const ga = playerScore[index].score.GA ? Number(playerScore[index].score.GA) + playerRecord.score.goalsAccepted : playerRecord.score.goalsAccepted;
          playerScore[index].score.GA = ga;
        }

        if (typeof playerScore[index].score.SA === 'undefined' && typeof playerScore[index].score.GA === 'number') {
          const sv = 0 - playerScore[index].score.GA;
          const svPercent = 0;
          playerScore[index].score.SV = sv;
          playerScore[index].score.SVPercent = svPercent;
        }

        if (typeof playerScore[index].score.SA === 'number' && typeof playerScore[index].score.GA === 'undefined') {
          const sv = playerScore[index].score.SA;
          const svPercent = 1;
          playerScore[index].score.SV = sv;
          playerScore[index].score.SVPercent = svPercent;
        }

        if (typeof playerScore[index].score.SA === 'number' && typeof playerScore[index].score.GA === 'number') {
          const sv = playerScore[index].score.SA - playerScore[index].score.GA;
          const svPercent = (1 - (playerScore[index].score.GA / playerScore[index].score.SA)) * 100;
          playerScore[index].score.SV = sv;
          playerScore[index].score.SVPercent = svPercent;
        }
        // TOI
        if (playerRecord.score.runningTime) {
          const toi = playerScore[index].score.TOI ? Number(playerScore[index].score.TOI) + playerRecord.score.runningTime : playerRecord.score.runningTime;
          playerScore[index].score.TOI = toi;
        }
      });

      // GP Team 참가횟수 더하기
      teams.forEach((team) => {
        const index = teamScore.findIndex(((score) => score.teamId === team.teamId));
        if (index === -1) {
          teamScore.push({ teamId: team.teamId, score: { GP: 1 } });
        } else {
          const gamesPlayed = teamScore[index].score.GP ? Number(teamScore[index].score.GP) + 1 : 1;
          teamScore[index].score.GP = gamesPlayed;
        }
      });

      const homeTeamIndex = teamScore.findIndex(((score) => score.teamId === teams[0].teamId));
      const awayTeamIndex = teamScore.findIndex(((score) => score.teamId === teams[1].teamId));

      // team records
      teams.forEach((teamRecord) => {
        // GF 팀의 득점 모두 더하기 goal부문, GD
        if (teamRecord.score ? teamRecord.score.goal : false) {
          const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
          const goal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.goal : teamRecord.score.goal;
          teamScore[index].score.GF = goal;
        }
        // GF 팀의 득점 모두 더하기 otGoal부문.
        if (teamRecord.score ? teamRecord.score.otGoal : false) {
          const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
          const otGoal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.otGoal : teamRecord.score.otGoal;
          teamScore[index].score.GF = otGoal;
        }

        // GA 먹힌골 더하기.
        if (teamRecord.score ? teamRecord.score.goalsAgainst : false) {
          const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
          const goalsAgainstRecord = teamScore[index].score.GA ? Number(teamScore[index].score.GA) + teamRecord.score.goalsAgainst : teamRecord.score.goalsAgainst;
          teamScore[index].score.GA = goalsAgainstRecord;
        }
      });

      const giveMeWinnerTeam = () => {
        const homeTeamGoalCount = teams[0].score.goal ? teams[0].score.goal : 0;
        const awayTeamGoalCount = teams[1].score.goal ? teams[1].score.goal : 0;
        const homeTeamOTGoalTrue = teams[0].score.otGoal;
        const awayTeamOTGoalTrue = teams[1].score.otGoal;
        if (homeTeamGoalCount > awayTeamGoalCount) {
          return 'homeTeamWin';
        }

        if (homeTeamGoalCount < awayTeamGoalCount) {
          return 'awayTeamWin';
        }

        if ((homeTeamGoalCount === awayTeamGoalCount) && homeTeamOTGoalTrue) {
          return 'homeTeamOTWin';
        }

        if ((homeTeamGoalCount === awayTeamGoalCount) && awayTeamOTGoalTrue) {
          return 'awayTeamOTWin';
        }

        if ((homeTeamGoalCount === awayTeamGoalCount) && !awayTeamOTGoalTrue && !awayTeamOTGoalTrue) {
          if (homeTeamGoalCount === 0 && awayTeamGoalCount === 0) {
            return '';
          }
          return 'Tie';
        }
      };

      const winnerTeam = giveMeWinnerTeam();
      // W, L, T
      if (winnerTeam === 'homeTeamWin') {
        if (teamScore[homeTeamIndex].score.W === undefined) {
          teamScore[homeTeamIndex].score.W = 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 3;
          } else {
            teamScore[homeTeamIndex].score.PTS += 3;
          }
        } else {
          teamScore[homeTeamIndex].score.W += 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 3;
          } else {
            teamScore[homeTeamIndex].score.PTS += 3;
          }
        }
        if (teamScore[awayTeamIndex].score.L === undefined) {
          teamScore[awayTeamIndex].score.L = 1;
        } else {
          teamScore[awayTeamIndex].score.L += 1;
        }
      }

      if (winnerTeam === 'awayTeamWin') {
        if (teamScore[awayTeamIndex].score.W === undefined) {
          teamScore[awayTeamIndex].score.W = 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 3;
          } else {
            teamScore[awayTeamIndex].score.PTS += 3;
          }
        } else if (teamScore[awayTeamIndex].score.W) {
          teamScore[awayTeamIndex].score.W += 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 3;
          } else {
            teamScore[awayTeamIndex].score.PTS += 3;
          }
        }
        if (teamScore[homeTeamIndex].score.L === undefined) {
          teamScore[homeTeamIndex].score.L = 1;
        } else if (teamScore[homeTeamIndex].score.L) {
          teamScore[homeTeamIndex].score.L += 1;
        }
      }

      if (winnerTeam === 'homeTeamOTWin') {
        if (teamScore[homeTeamIndex].score.OTW === undefined) {
          teamScore[homeTeamIndex].score.OTW = 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 2;
          } else {
            teamScore[homeTeamIndex].score.PTS += 2;
          }
        } else {
          teamScore[homeTeamIndex].score.OTW += 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 2;
          } else {
            teamScore[homeTeamIndex].score.PTS += 2;
          }
        }
        if (teamScore[awayTeamIndex].score.OTL === undefined) {
          teamScore[awayTeamIndex].score.OTL = 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 1;
          } else {
            teamScore[awayTeamIndex].score.PTS += 1;
          }
        } else {
          teamScore[awayTeamIndex].score.OTL += 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 1;
          } else {
            teamScore[awayTeamIndex].score.PTS += 1;
          }
        }
      }

      if (winnerTeam === 'awayTeamOTWin') {
        if (teamScore[awayTeamIndex].score.W === undefined) {
          teamScore[awayTeamIndex].score.OTW = 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 2;
          } else {
            teamScore[awayTeamIndex].score.PTS += 2;
          }
        } else {
          teamScore[awayTeamIndex].score.OTW = 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 2;
          } else {
            teamScore[awayTeamIndex].score.PTS += 2;
          }
        }
        if (teamScore[homeTeamIndex].score.OTL === undefined) {
          teamScore[homeTeamIndex].score.OTL = 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 1;
          } else {
            teamScore[homeTeamIndex].score.PTS += 1;
          }
        } else {
          teamScore[homeTeamIndex].score.OTL += 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 1;
          } else {
            teamScore[homeTeamIndex].score.PTS += 1;
          }
        }
      }

      if (winnerTeam === 'Tie') {
        if (teamScore[homeTeamIndex].score.T) {
          teamScore[homeTeamIndex].score.T += 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 1;
          } else {
            teamScore[homeTeamIndex].score.PTS += 1;
          }
        }
        if (teamScore[awayTeamIndex].score.T) {
          teamScore[awayTeamIndex].score.T += 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 1;
          } else {
            teamScore[awayTeamIndex].score.PTS += 1;
          }
        }
        if (teamScore[homeTeamIndex].score.T === undefined) {
          teamScore[homeTeamIndex].score.T = 1;
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 1;
          } else {
            teamScore[homeTeamIndex].score.PTS += 1;
          }
        }
        if (teamScore[awayTeamIndex].score.T === undefined) {
          teamScore[awayTeamIndex].score.T = 1;
          if (teamScore[awayTeamIndex].score.PTS === undefined) {
            teamScore[awayTeamIndex].score.PTS = 1;
          } else {
            teamScore[awayTeamIndex].score.PTS += 1;
          }
        }
      }
    }
  }
  // GD 계산
  teamScore.forEach((team, index) => {
    if (typeof team.score.GF === 'undefined' && typeof team.score.GA === 'undefined') {
      teamScore[index].score.GD = 0;
    }

    if (typeof team.score.GF === 'undefined' && typeof team.score.GA === 'number') {
      const gd = 0 - Number(team.score.GA);
      teamScore[index].score.GD = gd;
    }

    if (typeof team.score.GF === 'number' && typeof team.score.GA === 'undefined') {
      const gd = Number(team.score.GF) - 0;
      teamScore[index].score.GD = gd;
    }

    if (typeof team.score.GF === 'number' && typeof team.score.GA === 'number') {
      const gd = Number(team.score.GF) - Number(team.score.GA);
      teamScore[index].score.GD = gd;
    }
  });
  return { playerScore, teamScore };
};

const getAllDivisionsWithTeamId = async (teamId) => {
  const allDivisions = await Division.find({ teamScore: { $elemMatch: { teamId } } });
  const divisionScroe = allDivisions.map((d) => {
    const teamScore = d.teamScore.find((score) => score.teamId === teamId);
    const result = {
      leagueId: d.leagueId,
      name: d.name,
      teamScore,
      playerScore: d.playerScore,
    };
    return result;
  });
  return divisionScroe;
};

const getAllDivisionsWithPlayer = async (playerId) => {
  const allDivisions = await Division.find({ playerScore: { $elemMatch: { playerId } } });
  const divisionScroe = allDivisions.map((d) => {
    const result = {
      leagueId: d.leagueId,
      name: d.name,
      playerScore: d.playerScore,
    };
    return result;
  });
  return divisionScroe;
};

module.exports = {
  createDivision,
  queryDivisions,
  getDivisionById,
  updateDivisionById,
  deleteDivisionById,
  parseTournamentResult,
  getAllDivisionsWithTeamId,
  getAllDivisionsWithPlayer,
};

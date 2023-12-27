const httpStatus = require('http-status');
const {
  Division,
  League,
  Tournament,
  Team,
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

  return {
    id: division._id,
    team: participateTeam,
    leagueId: division.leagueId,
    leagueName: leagueInfo.name,
    name: division.name,
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
  const team = await getDivisionById(divisionId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'division not found');
  }
  await team.remove();
  return team;
};

const parseTournamentResult = async (divisionId) => {
  // divisionId로 모든 tournament들을 검색.
  const tournaments = await Tournament.find({ divisionId });
  if (!tournaments) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournaments not found');
  }

  const playerScore = [];
  const teamScore = [];

  for (let i = 0; i < tournaments.length; i += 1) {
    const { players, teams } = tournaments[i];
    // GP player
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
      if (playerRecord.score ? playerRecord.score.goal : false) {
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { G: playerRecord.score.goal, PTS: playerRecord.score.goal } });
        } else {
          const goal = playerScore[index].score.G ? Number(playerScore[index].score.G) + playerRecord.score.goal : playerRecord.score.goal;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.goal : playerRecord.score.goal;
          playerScore[index].score.G = goal;
          playerScore[index].score.PTS = pts;
        }
      }

      // A1, PTS
      if (playerRecord.score ? playerRecord.score.a1 : false) {
        // 선수의 a1이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { A: playerRecord.score.a1, PTS: playerRecord.score.a1 } });
        } else {
          const assist = playerScore[index].score.A ? Number(playerScore[index].score.A) + playerRecord.score.a1 : playerRecord.score.a1;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.a1 : playerRecord.score.a1;
          playerScore[index].score.A = assist;
          playerScore[index].score.PTS = pts;
        }
      }

      // A2, PTS
      if (playerRecord.score ? playerRecord.score.a2 : false) {
        // 선수의 a2이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { A: playerRecord.score.a2, PTS: playerRecord.score.a2 } });
        } else {
          const assist = playerScore[index].score.A ? Number(playerScore[index].score.A) + playerRecord.score.a2 : playerRecord.score.a2;
          const pts = playerScore[index].score.PTS ? Number(playerScore[index].score.PTS) + playerRecord.score.a2 : playerRecord.score.a2;
          playerScore[index].score.A = assist;
          playerScore[index].score.PTS = pts;
        }
      }

      // PIM
      if (playerRecord.score ? playerRecord.score.penaltyMin : false) {
        // 선수의 penaltyMin이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { PIM: playerRecord.score.penaltyMin } });
        } else {
          const pim = playerScore[index].score.PIM ? Number(playerScore[index].score.PIM) + playerRecord.score.penaltyMin : playerRecord.score.penaltyMin;
          playerScore[index].score.PIM = pim;
        }
      }

      // P
      if (playerRecord.score ? playerRecord.score.penaltyCount : false) {
        // 선수의 penaltyCount이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { P: playerRecord.score.penaltyCount } });
        } else {
          const p = playerScore[index].score.P ? Number(playerScore[index].score.P) + playerRecord.score.penaltyCount : playerRecord.score.penaltyCount;
          playerScore[index].score.P = p;
        }
      }

      // SA
      if (playerRecord.score ? playerRecord.score.goalsBlocked : false) {
        // 선수의 goalsBlocked 이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { SA: playerRecord.score.goalsBlocked } });
        } else {
          const sa = playerScore[index].score.SA ? Number(playerScore[index].score.SA) + playerRecord.score.goalsBlocked : playerRecord.score.goalsBlocked;
          playerScore[index].score.SA = sa;
        }
      }

      // GA, SV, SV%
      if (playerRecord.score ? playerRecord.score.goalsAccepted : false) {
        // 선수의 goalsAccepted 이 있는 경우
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({
            playerId: playerRecord.playerId,
            score: {
              GA: playerRecord.score.goalsAccepted,
              SV: playerRecord.score.goalsBlocked - playerRecord.score.goalsAccepted,
              SVPercent: (1 - (playerRecord.score.goalsAccepted / playerRecord.score.goalsBlocked)) * 100,
            },
          });
        } else {
          const ga = playerScore[index].score.GA ? Number(playerScore[index].score.GA) + playerRecord.score.goalsAccepted : playerRecord.score.goalsAccepted;
          const sv = playerScore[index].score.SV
            ? (Number(playerScore[index].score.SV) + playerRecord.score.goalsBlocked - playerRecord.score.goalsAccepted)
            : (playerRecord.score.goalsBlocked - playerRecord.score.goalsAccepted);
          const svPercent = (1 - (playerRecord.score.goalsAccepted / playerRecord.score.goalsBlocked)) * 100;
          playerScore[index].score.GA = ga;
          playerScore[index].score.SV = sv;
          playerScore[index].score.SVPercent = svPercent;
        }
      }

      // TOI
      if (playerRecord.score ? playerRecord.score.runningTime : false) {
        const index = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (index === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { runningTime: playerRecord.score.runningTime } });
        } else {
          const toi = playerScore[index].score.TOI ? Number(playerScore[index].score.TOI) + playerRecord.score.runningTime : playerRecord.score.runningTime;
          playerScore[index].score.TOI = toi;
        }
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

    // team records
    teams.forEach((teamRecord) => {
      // GF 팀의 득점 모두 더하기 goal부문.
      if (teamRecord.score ? teamRecord.score.goal : false) {
        const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
        if (index === -1) {
          teamScore.push({ teamId: teamRecord.teamId, score: { GF: teamRecord.score.goal } });
        } else {
          const goal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.goal : teamRecord.score.goal;
          teamScore[index].score.GF = goal;
        }
      }
      // GF 팀의 득점 모두 더하기 otGoal부문.
      if (teamRecord.score ? teamRecord.score.otGoal : false) {
        const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
        if (index === -1) {
          teamScore.push({ teamId: teamRecord.teamId, score: { GF: teamRecord.score.otGoal } });
        } else {
          const otGoal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.otGoal : teamRecord.score.otGoal;
          teamScore[index].score.GF = otGoal;
        }
      }

      // GA 먹힌골 더하기. goalsAgainst
      if (teamRecord.score ? teamRecord.score.goalsAgainst : false) {
        const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
        if (index === -1) {
          const currentGF = teamScore[index].score.GF;
          teamScore.push({ teamId: teamRecord.teamId, score: { GA: teamRecord.score.goalsAgainst, GD: currentGF - teamRecord.score.goalsAgainst } });
        } else {
          const goalsAgainstRecord = teamScore[index].score.GA ? Number(teamScore[index].score.GA) + teamRecord.score.goalsAgainst : teamRecord.score.goalsAgainst;
          teamScore[index].score.GA = goalsAgainstRecord;

          const currentGF = teamScore[index].score.GF;
          teamScore[index].score.GD = currentGF - goalsAgainstRecord;
        }
      }
    });

    const giveMeWinnerTeam = (data) => {
      const homeTeamGoalCount = data[0].score.goal ? data[0].score.goal : 0;
      const awayTeamGoalCount = data[1].score.goal ? data[1].score.goal : 0;
      const homeTeamOTGoalTrue = data[0].score.otGoal;
      const awayTeamOTGoalTrue = data[1].score.otGoal;
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

    const winnerTeam = giveMeWinnerTeam(teams);
    // W, L, T
    if (winnerTeam === 'homeTeamWin') {
      if (teamScore[0].score.W === undefined) {
        teamScore[0].score.W = 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 3;
        } else {
          teamScore[0].score.PTS += 3;
        }
      } else {
        teamScore[0].score.W += 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 3;
        } else {
          teamScore[0].score.PTS += 3;
        }
      }
      if (teamScore[1].score.L === undefined) {
        teamScore[1].score.L = 1;
      } else {
        teamScore[1].score.L += 1;
      }
    }

    if (winnerTeam === 'awayTeamWin') {
      if (teamScore[1].score.W === undefined) {
        teamScore[1].score.W = 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 3;
        } else {
          teamScore[1].score.PTS += 3;
        }
      } else if (teamScore[1].score.W) {
        teamScore[1].score.W += 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 3;
        } else {
          teamScore[1].score.PTS += 3;
        }
      }
      if (teamScore[0].score.L === undefined) {
        teamScore[0].score.L = 1;
      } else if (teamScore[0].score.L) {
        teamScore[0].score.L += 1;
      }
    }

    if (winnerTeam === 'homeTeamOTWin') {
      if (teamScore[0].score.OTW === undefined) {
        teamScore[0].score.OTW = 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 2;
        } else {
          teamScore[0].score.PTS += 2;
        }
      } else {
        teamScore[0].score.OTW += 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 2;
        } else {
          teamScore[0].score.PTS += 2;
        }
      }
      if (teamScore[1].score.OTL === undefined) {
        teamScore[1].score.OTL = 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 1;
        } else {
          teamScore[1].score.PTS += 1;
        }
      } else {
        teamScore[1].score.OTL += 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 1;
        } else {
          teamScore[1].score.PTS += 1;
        }
      }
    }

    if (winnerTeam === 'awayTeamOTWin') {
      if (teamScore[1].score.W === undefined) {
        teamScore[1].score.OTW = 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 2;
        } else {
          teamScore[1].score.PTS += 2;
        }
      } else {
        teamScore[1].score.OTW = 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 2;
        } else {
          teamScore[1].score.PTS += 2;
        }
      }
      if (teamScore[0].score.OTL === undefined) {
        teamScore[0].score.OTL = 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 1;
        } else {
          teamScore[0].score.PTS += 1;
        }
      } else {
        teamScore[0].score.OTL += 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 1;
        } else {
          teamScore[0].score.PTS += 1;
        }
      }
    }

    if (winnerTeam === 'Tie') {
      if (teamScore[0].score.T) {
        teamScore[0].score.T += 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 1;
        } else {
          teamScore[0].score.PTS += 1;
        }
      }
      if (teamScore[1].score.T) {
        teamScore[1].score.T += 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 1;
        } else {
          teamScore[1].score.PTS += 1;
        }
      }
      if (teamScore[0].score.T === undefined) {
        teamScore[0].score.T = 1;
        if (teamScore[0].score.PTS === undefined) {
          teamScore[0].score.PTS = 1;
        } else {
          teamScore[0].score.PTS += 1;
        }
      }
      if (teamScore[1].score.T === undefined) {
        teamScore[1].score.T = 1;
        if (teamScore[1].score.PTS === undefined) {
          teamScore[1].score.PTS = 1;
        } else {
          teamScore[1].score.PTS += 1;
        }
      }
    }
  }
  return { playerScore, teamScore };
};

module.exports = {
  createDivision,
  queryDivisions,
  getDivisionById,
  updateDivisionById,
  deleteDivisionById,
  parseTournamentResult,
};

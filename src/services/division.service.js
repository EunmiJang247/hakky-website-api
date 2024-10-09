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
  const divisions = await Division.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
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
  if (!tournaments || tournaments.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournaments not found');
  }

  const playerScore = [];
  const teamScore = [];

  for (let i = 0; i < tournaments.length; i += 1) {
    const { players, teams } = tournaments[i];
    // teams가 존재하는지 확인 (에러 방지)
    if (!teams || teams.length === 0) {
      return;
    }
    // division에 속하는 모든 경기들을 순환함.

    let goalsCount = 0;
    let otGoalCount = 0;
    // // 아직 시작된 경기인지 아닌지 판별할때
    // teams.forEach((team) => {
    //   if (team.score && team.score.goal > 0) {
    //     goalsCount += 1;
    //   }
    // });

    // let otGoalCount = 0;
    // // 연장전으로 승리한 경기인지 아닌지 판별할 때 쓴다
    // teams.forEach((team) => {
    //   if (team.score && team.score.otGoal && team.score.otGoal > 0) {
    //     otGoalCount += 1;
    //   }
    // });
    for (let j = 0; j < teams.length; j += 1) {
      if (teams[j].score.goal > 0) {
        goalsCount += 1;
      }
    }

    for (let k = 0; k < teams.length; k += 1) {
      if (teams[k].score.otGoal > 0) {
        otGoalCount += 1;
      }
    }

    if (goalsCount === 0 && otGoalCount === 0) {
      // 아직 시작된 경기도 아니고 연장전으로 끝난 경기도 아닐 때
      teams.forEach((team) => {
        if (!team.teamId) {
          return; // teamId가 없으면 해당 팀은 건너뜀
        }
        // 각 팀의 정보를 순회하면서 팀의 게임 참가 횟수(GP, Games Played)를 기록
        const index = teamScore.findIndex(((score) => score.teamId === team.teamId));
        // 현재 팀의 teamId와 일치하는 팀이 teamScore 배열에 있는지 확인
        if (index === -1) {
          // teamScore 배열에 해당 팀이 없다면 새로 추가하고, GP(참가 횟수)를 0으로 초기화
          teamScore.push({ teamId: team.teamId, score: { GP: 0 } });
        } else {
          // 이미 존재하는 팀이면 해당 팀의 GP(참가 횟수)를 가져옴, 기본값은 0
          teamScore[index].score.GP = teamScore[index].score.GP ? Number(teamScore[index].score.GP) : 0;
        }
      });

      // 각 선수의 기록을 순회하면서 플레이어의 게임 참가 횟수(GP, Games Played)를 기록
      players.forEach((playerRecord) => {
        // 현재 선수의 playerId와 일치하는 선수가 playerScore 배열에 있는지 확인
        const indexPlayer = playerScore.findIndex(((score) => score.playerId === playerRecord.playerId));
        if (indexPlayer === -1) {
          playerScore.push({ playerId: playerRecord.playerId, score: { GP: 0 } });
        } else {
          playerScore[indexPlayer].score.GP = playerScore[indexPlayer].score.GP ? Number(playerScore[indexPlayer].score.GP) : 0;
        }
      });
    }

    if (goalsCount !== 0 || (goalsCount === 0 && otGoalCount !== 0)) {
      // goal이 기록된 적이 있거나 otGoalCount가 발생한 경우(즉 토너먼트가 실행된 경우)
      players.forEach((playerRecord) => {
      // GP player 골이 발생한 경우 GP를 올려준다.
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
        // "players": [
        //   {
        //     "score": {
        //       "goal": 0
        //     }
        //   },
        //   {
        //     "playerId": "65b4ae3e6fc0cc003a2fee5f",
        //     "score": {
        //       "goal": 1
        //     }
        //   },
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
      // teams 예시
      // "teams": [
      //   {
      //     "teamId": "6595910ec55396557e81e1ec",
      //     "score": {
      //       "goal": 1,
      //       "a1": 1,
      //       "goalsAgainst": 6,
      //       "penaltyMin": 4,
      //       "penaltyCount": 2,
      //       "goalsBlocked": 30,
      //       "goalsAccepted": 6
      //     }
      //   },
      //   {
      //     "teamId": "6595912ac55396557e81e1f4",
      //     "score": {
      //       "goal": 6,
      //       "goalsAgainst": 1,
      //       "a1": 3,
      //       "a2": 1,
      //       "goalsBlocked": 11,
      //       "goalsAccepted": 1
      //     }
      //   }
      // ],
      teams.forEach((team) => {
        if (team.teamId) {
          const index = teamScore.findIndex(((score) => score.teamId === team.teamId));
          if (index === -1) {
            // teamScore에 팀이 없으면 새로 추가
            teamScore.push({ teamId: team.teamId, score: { GP: 1 } });
          } else {
            // teamScore에 팀이 있으면 GP를 증가
            // score 객체가 존재하지 않으면 초기화
            if (!teamScore[index].score) {
              teamScore[index].score = { GP: 0 };
            }
            const gamesPlayed = teamScore[index].score.GP ? Number(teamScore[index].score.GP) + 1 : 1;
            teamScore[index].score.GP = gamesPlayed;
          }
        }
      });

      if (teams && teams.length >= 2 && teams[0].teamId && teams[1].teamId) {
        // teamScore 배열에서 홈팀의 인덱스
        const homeTeamIndex = teamScore.findIndex(((score) => score.teamId === teams[0].teamId));
        // teamScore 배열에서 어웨이 팀의 인덱스
        const awayTeamIndex = teamScore.findIndex(((score) => score.teamId === teams[1].teamId));

        // team records
        teams.forEach((teamRecord) => {
          // GF goal이 생겼을 때 GF를 더함
          if (teamRecord.teamId && teamRecord.score && typeof teamRecord.score.goal === 'number') {
            const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
            const goal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.goal : teamRecord.score.goal;
            teamScore[index].score.GF = goal;
          }
          // GF otGoal이 생겼을 때 GF를 더함
          if (teamRecord.teamId && teamRecord.score && typeof teamRecord.score.otGoal === 'number') {
            const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
            const otGoal = teamScore[index].score.GF ? Number(teamScore[index].score.GF) + teamRecord.score.otGoal : teamRecord.score.otGoal;
            teamScore[index].score.GF = otGoal;
          }

          // GA goalsAgainst 먹힌골 더하기.
          if (teamRecord.teamId && teamRecord.score && typeof teamRecord.score.goalsAgainst === 'number') {
            const index = teamScore.findIndex(((score) => score.teamId === teamRecord.teamId));
            const goalsAgainstRecord = teamScore[index].score.GA ? Number(teamScore[index].score.GA) + teamRecord.score.goalsAgainst : teamRecord.score.goalsAgainst;
            teamScore[index].score.GA = goalsAgainstRecord;
          }
        });
        const giveMeWinnerTeam = () => {
          // 승리한 팀을 구분해내는 함수
          // 홈팀이 기록한 골 수
          const homeTeamGoalCount = teams[0].score && typeof teams[0].score.goal === 'number' ? teams[0].score.goal : 0;
          // 어웨이 팀이 기록한 골 수
          const awayTeamGoalCount = teams[1].score && typeof teams[1].score.goal === 'number' ? teams[1].score.goal : 0;
          const homeTeamOTGoalCount = teams[0].score && typeof teams[0].score.otGoal === 'number' ? teams[0].score.otGoal : 0;
          // 홈팀의 연장전 골이 있는지
          const awayTeamOTGoalCount = teams[1].score && typeof teams[1].score.otGoal === 'number' ? teams[1].score.otGoal : 0;
          // 어웨이팀의 연장전 골이 있는지
          if (homeTeamGoalCount > awayTeamGoalCount) {
            return 'homeTeamWin';
          }

          if (homeTeamGoalCount < awayTeamGoalCount) {
            return 'awayTeamWin';
          }

          if ((homeTeamGoalCount === awayTeamGoalCount) && (homeTeamOTGoalCount > awayTeamOTGoalCount)) {
            return 'homeTeamOTWin';
          }

          if ((homeTeamGoalCount === awayTeamGoalCount) && (awayTeamOTGoalCount > homeTeamOTGoalCount)) {
            return 'awayTeamOTWin';
          }

          if ((homeTeamGoalCount === awayTeamGoalCount) && (awayTeamOTGoalCount === homeTeamOTGoalCount)) {
            if (homeTeamGoalCount === 0 && awayTeamGoalCount === 0) {
              // 양팀 모두 득점이 없는 경우로, 경기가 치뤄지지 않은 경우
              return 'noWinner';
            }
            return 'Tie';
          }
        };

        const winnerTeam = giveMeWinnerTeam();
        if (winnerTeam === 'homeTeamWin') {
          // 홈팀이 이긴 경우
          if (teamScore[homeTeamIndex]) {
            // 홈팀의 승리횟수 처리
            if (teamScore[homeTeamIndex].score.W === undefined) {
              // 홈팀이 승리한 적이 없을 때
              teamScore[homeTeamIndex].score.W = 1;
            } else {
              // 홈팀이 승리한 적이 있을 때
              teamScore[homeTeamIndex].score.W += 1;
            }

            // 포인트(PTS) 처리
            if (teamScore[homeTeamIndex].score.PTS === undefined) {
              // 홈팀에 PTS점수 3점을 줌.
              teamScore[homeTeamIndex].score.PTS = 3;
            } else {
              teamScore[homeTeamIndex].score.PTS += 3;
            }

            // 어웨이팀 패배 처리
            if (teamScore[awayTeamIndex].score.L === undefined) {
              // 패배 팀에 L에 1을 더함
              teamScore[awayTeamIndex].score.L = 1;
            } else {
              teamScore[awayTeamIndex].score.L += 1;
            }
          }
        }

        if (winnerTeam === 'awayTeamWin') {
          if (teamScore[awayTeamIndex]) {
          // 어웨이팀 승리 처리
            if (teamScore[awayTeamIndex].score.W === undefined) {
              teamScore[awayTeamIndex].score.W = 1;
            } else {
              teamScore[awayTeamIndex].score.W += 1;
            }

            // 포인트(PTS) 처리
            if (teamScore[awayTeamIndex].score.PTS === undefined) {
              teamScore[awayTeamIndex].score.PTS = 3;
            } else {
              teamScore[awayTeamIndex].score.PTS += 3;
            }
          }

          // 홈팀 패배 처리
          if (teamScore[homeTeamIndex]) {
            if (teamScore[homeTeamIndex].score.L === undefined) {
              teamScore[homeTeamIndex].score.L = 1;
            } else {
              teamScore[homeTeamIndex].score.L += 1;
            }
          }
        }

        if (winnerTeam === 'homeTeamOTWin') {
          // 홈팀이 연장전 승리로 이긴 경우
          if (teamScore[homeTeamIndex].score.OTW === undefined) {
            teamScore[homeTeamIndex].score.OTW = 1;
          } else {
            teamScore[homeTeamIndex].score.OTW += 1;
          }

          // 포인트(PTS) 처리 연장전으로 이긴 경우 2를 더한다
          if (teamScore[homeTeamIndex].score.PTS === undefined) {
            teamScore[homeTeamIndex].score.PTS = 2;
          } else {
            teamScore[homeTeamIndex].score.PTS += 2;
          }

          // 어웨이팀 연장전 패배 처리
          if (teamScore[awayTeamIndex]) {
            // 연장전 패배 횟수(OTL) 처리
            if (teamScore[awayTeamIndex].score.OTL === undefined) {
              teamScore[awayTeamIndex].score.OTL = 1;
            } else {
              teamScore[awayTeamIndex].score.OTL += 1;
            }

            // 포인트(PTS) 처리. 연장전으로 진 경우 PTS에 1을 더한다
            if (teamScore[awayTeamIndex].score.PTS === undefined) {
              teamScore[awayTeamIndex].score.PTS = 1;
            } else {
              teamScore[awayTeamIndex].score.PTS += 1;
            }
          }
        }

        if (winnerTeam === 'awayTeamOTWin') {
          // 연장전으로 어웨이 팀이 이긴 경우
          if (teamScore[awayTeamIndex]) {
            if (teamScore[awayTeamIndex].score.OTW === undefined) {
              teamScore[awayTeamIndex].score.OTW = 1;
            } else {
              teamScore[awayTeamIndex].score.OTW += 1;
            }

            // 포인트(PTS) 처리. 연장전으로 이긴 경우 +2점
            if (teamScore[awayTeamIndex].score.PTS === undefined) {
              teamScore[awayTeamIndex].score.PTS = 2;
            } else {
              teamScore[awayTeamIndex].score.PTS += 2;
            }
          }
          // 홈팀 연장전 패배 처리
          if (teamScore[homeTeamIndex]) {
            // 연장전 패배 횟수(OTL) 처리
            if (teamScore[homeTeamIndex].score.OTL === undefined) {
              teamScore[homeTeamIndex].score.OTL = 1;
            } else {
              teamScore[homeTeamIndex].score.OTL += 1;
            }

            // 포인트(PTS) 처리. 연장전으로 진 경우 +1점
            if (teamScore[homeTeamIndex].score.PTS === undefined) {
              teamScore[homeTeamIndex].score.PTS = 1;
            } else {
              teamScore[homeTeamIndex].score.PTS += 1;
            }
          }
        }

        if (winnerTeam === 'Tie') {
          // 홈팀 처리
          if (teamScore[homeTeamIndex]) {
            if (teamScore[homeTeamIndex].score.T === undefined) {
              teamScore[homeTeamIndex].score.T = 1;
            } else {
              teamScore[homeTeamIndex].score.T += 1;
            }
            if (teamScore[homeTeamIndex].score.PTS === undefined) {
              teamScore[homeTeamIndex].score.PTS = 1;
            } else {
              teamScore[homeTeamIndex].score.PTS += 1;
            }
          }
          // 어웨이팀 처리
          if (teamScore[awayTeamIndex]) {
            if (teamScore[awayTeamIndex].score.T === undefined) {
              teamScore[awayTeamIndex].score.T = 1;
            } else {
              teamScore[awayTeamIndex].score.T += 1;
            }
            if (teamScore[awayTeamIndex].score.PTS === undefined) {
              teamScore[awayTeamIndex].score.PTS = 1;
            } else {
              teamScore[awayTeamIndex].score.PTS += 1;
            }
          }
        }
      }
    }
  }
  // GD 계산
  teamScore.forEach((team, index) => {
    // GF와 GA가 모두 없는 경우 GD는 0
    if (typeof team.score.GF === 'undefined' && typeof team.score.GA === 'undefined') {
      teamScore[index].score.GD = 0;
    } else if (typeof team.score.GF === 'undefined' && typeof team.score.GA === 'number') {
      // GF가 없는 경우 (GA만 있는 경우)
      teamScore[index].score.GD = -Number(team.score.GA);
    } else if (typeof team.score.GF === 'number' && typeof team.score.GA === 'undefined') {
      // GA가 없는 경우 (GF만 있는 경우)
      teamScore[index].score.GD = Number(team.score.GF);
    } else if (typeof team.score.GF === 'number' && typeof team.score.GA === 'number') {
      // GF와 GA 모두 있는 경우
      teamScore[index].score.GD = Number(team.score.GF) - Number(team.score.GA);
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

// const httpStatus = require('http-status');
const { Tournament } = require('../models');
// const ApiError = require('../utils/ApiError');

const queryTournaments = async ({ divisionId, limit, skip }) => {
  const tournaments = await Tournament.find({ divisionId }).limit(limit).skip(skip);
  const count = await Tournament.countDocuments();
  return {
    result: tournaments,
    count,
  };
};

module.exports = {
  queryTournaments,
};

// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tournamentService } = require('../services');
// const ApiError = require('../utils/ApiError');

const getTournaments = catchAsync(async (req, res) => {
  const result = await tournamentService.queryTournaments({
    divisionId: req.query.divisionId,
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

module.exports = {
  getTournaments,
};

const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { divisionService } = require('../services');
const ApiError = require('../utils/ApiError');

const createDivision = catchAsync(async (req, res) => {
  const division = await divisionService.createDivision(req.body);
  res.status(httpStatus.CREATED).send(division);
});

const getDivisions = catchAsync(async (req, res) => {
  const divisions = await divisionService.queryDivisions({
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(divisions);
});

const getDivision = catchAsync(async (req, res) => {
  const division = await divisionService.getDivisionById(req.params.divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division not found');
  }
  res.send(division);
});

const updateDivision = catchAsync(async (req, res) => {
  const division = await divisionService.updateDivisionById(req.params.divisionId, req.body);
  res.send(division);
});

const deleteDivision = catchAsync(async (req, res) => {
  await divisionService.deleteDivisionById(req.params.divisionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,
};

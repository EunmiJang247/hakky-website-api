const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { youtubeService } = require('../services');
const ApiError = require('../utils/ApiError');

const createYoutube = catchAsync(async (req, res) => {
  const team = await youtubeService.createYoutube(req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getYoutubes = catchAsync(async (req, res) => {
  const result = await youtubeService.queryYoutubes({
    limit: req.query.limit,
    skip: req.query.skip,
  });
  res.send(result);
});

const getYoutube = catchAsync(async (req, res) => {
  const team = await youtubeService.getYoutubeById(req.params.youtubeId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  res.send(team);
});

const updateYoutube = catchAsync(async (req, res) => {
  const team = await youtubeService.updateYoutbeById(req.params.youtubeId, req.body);
  res.send(team);
});

const deleteYoutube = catchAsync(async (req, res) => {
  await youtubeService.deleteYoutubeById(req.params.youtubeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createYoutube,
  getYoutubes,
  getYoutube,
  updateYoutube,
  deleteYoutube,
};

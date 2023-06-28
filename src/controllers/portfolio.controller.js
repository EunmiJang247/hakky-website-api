const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { portfolioService } = require('../services');

const createPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.createPortFolio(req.body);
  res.status(httpStatus.CREATED).send(portfolio);
});

const getPortfolios = catchAsync(async (req, res) => {
  const portfolios = await portfolioService.readPortFolios();
  res.send(portfolios);
});

const getPortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.readPortFolio(req.params.portfolioId);
  if (!portfolio) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(portfolio);
});

const updatePortfolio = catchAsync(async (req, res) => {
  const portfolio = await portfolioService.updatePortFolio(req.params.portfolioId, req.body);
  res.send(portfolio);
});

const deletePortfolio = catchAsync(async (req, res) => {
  await portfolioService.deletePortFolio(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
};

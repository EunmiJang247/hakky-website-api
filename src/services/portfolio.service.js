const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const PortFolio = require('../models/index');

const createPortFolio = async (portfolioBody) => PortFolio.create(portfolioBody);

const readPortFolio = async (id) => {
  const portfolio = PortFolio.findById({ id });
  if (!portfolio) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 id를 가진 포트폴리오가 없습니다.');
  }
  return portfolio;
};

const readPortFolios = async () => {
  const portfolios = await PortFolio.find({}).sort('-id');
  return portfolios;
};

const updatePortFolio = async (id, portfolioBody) => {
  const portfolio = await PortFolio.findById(id);
  if (!portfolio) {
    throw new ApiError(httpStatus.BAD_REQUEST, '해당 id를 가진 포트폴리오가 없습니다.');
  }
  Object.assign(portfolio, portfolioBody);
  portfolio.save();

  return portfolio;
};

const deletePortFolio = async (id) => {
  const portfolio = PortFolio.deleteOne(id);
  return portfolio;
};

module.exports = {
  createPortFolio,
  readPortFolio,
  readPortFolios,
  updatePortFolio,
  deletePortFolio,
};

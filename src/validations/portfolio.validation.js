const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPortfolio = {
  body: Joi.object().keys({
    image: Joi.object().required(),
    title: Joi.string().required(),
  }).required(),
};

const readPortfolios = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const readPortfolio = {
  params: Joi.object().keys({
    portfolioId: Joi.string().custom(objectId),
  }),
};

const updatePortfolio = {
  params: Joi.object().keys({
    portfolioId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    image: Joi.object(),
    title: Joi.string(),
  }),
};

const deletePortFolio = {
  params: Joi.object().keys({
    portfolioId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  createPortfolio,
  readPortfolio,
  readPortfolios,
  updatePortfolio,
  deletePortFolio,
};

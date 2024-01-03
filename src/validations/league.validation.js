const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLeague = {
  params: Joi.object().keys({
    leagueId: Joi.string().custom(objectId),
  }),
};

const getLeague = {
  params: Joi.object().keys({
    leagueId: Joi.string().custom(objectId),
  }),
};

const getLeagues = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const updateLeague = {
  params: Joi.object().keys({
    leagueId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      year: Joi.string().required(),
      active: Joi.string().required(),
      regulation: Joi.string().allow(''),
    })
    .min(1),
};

const deleteLeague = {
  params: Joi.object().keys({
    leagueId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createLeague,
  getLeagues,
  getLeague,
  updateLeague,
  deleteLeague,
};

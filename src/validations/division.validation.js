const Joi = require('joi');
const { objectId } = require('./custom.validation');
// const { objectId } = require('./custom.validation');

const createDivision = {
  body: Joi.object().keys({
    leagueId: Joi.string().required(),
    leagueName: Joi.string().required(),
    name: Joi.string().required(),
    team: Joi.array().items(Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
    })),
  }),
};

const getDivisions = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const getDivision = {
  params: Joi.object().keys({
    divisionId: Joi.string().custom(objectId),
  }),
};

const updateDivision = {
  params: Joi.object().keys({
    divisionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      leagueId: Joi.string().required(),
      leagueName: Joi.string().required(),
      name: Joi.string().required(),
      team: Joi.array().items(Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
      })),
    })
    .min(1),
};

const deleteDivision = {
  params: Joi.object().keys({
    divisionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,
};

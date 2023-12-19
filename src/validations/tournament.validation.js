const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTournaments = {
  body: Joi.object().keys({
    tournamentDate: Joi.date().required(),
    awayTeamId: Joi.string().custom(objectId).required(),
    homeTeamId: Joi.string().custom(objectId).required(),
    venuePlace: Joi.string().required(),
    referee: Joi.string().required(),
    supervisor: Joi.string().required(),
    time: Joi.string().required(),
    divisionId: Joi.string().custom(objectId).required(),
    optionsGoalsHome: Joi.array(),
    optionPaneltiesHome: Joi.array(),
    optionGoalieSavesHome: Joi.array(),
    optionsGoalsAway: Joi.array(),
    optionPaneltiesAway: Joi.array(),
    optionGoalieSavesAway: Joi.array(),
  }),
};

const getTournaments = {
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

module.exports = {
  createTournaments,
  getTournaments,
};

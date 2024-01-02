const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTournaments = {
  body: Joi.object().keys({
    divisionId: Joi.string().custom(objectId).required(),
    tournamentDate: Joi.date().required(),
    venuePlace: Joi.string().required(),
    time: Joi.string().required(),
    supervisor: Joi.string().allow(''),
    referee: Joi.string().allow(''),
    homeTeamId: Joi.string().custom(objectId).required(),
    awayTeamId: Joi.string().custom(objectId).required(),
    optionsGoalsHome: Joi.array(),
    optionPaneltiesHome: Joi.array(),
    optionGoalieSavesHome: Joi.array(),
    optionsGoalsAway: Joi.array(),
    optionPaneltiesAway: Joi.array(),
    optionGoalieSavesAway: Joi.array(),
    optionsPlayersAway: Joi.array(),
    optionsPlayersHome: Joi.array(),
  }),
};

const getTournamentsCalendar = {
  query: Joi.object().keys({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  }),
};

const getTournaments = {
  query: Joi.object().keys({
    divisionId: Joi.string().required(),
  }),
};

const deleteTournaments = {
  params: Joi.object().keys({
    tournamentId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    divisionId: Joi.string().required(),
  }),
};

const getTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.string().required(),
  }),
};

const updateTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    divisionId: Joi.string().custom(objectId).required(),
    tournamentDate: Joi.date().required(),
    venuePlace: Joi.string().required(),
    time: Joi.string().required(),
    supervisor: Joi.string().allow(''),
    referee: Joi.string().allow(''),
    homeTeamId: Joi.string().custom(objectId).required(),
    awayTeamId: Joi.string().custom(objectId).required(),
    optionsPlayersHome: Joi.array(),
    optionsPlayersAway: Joi.array(),
    optionsGoalsHome: Joi.array(),
    optionPaneltiesHome: Joi.array(),
    optionGoalieSavesHome: Joi.array(),
    optionsGoalsAway: Joi.array(),
    optionPaneltiesAway: Joi.array(),
    optionGoalieSavesAway: Joi.array(),
  }),
};

module.exports = {
  createTournaments,
  getTournamentsCalendar,
  getTournaments,
  getTournament,
  updateTournament,
  deleteTournaments,
};

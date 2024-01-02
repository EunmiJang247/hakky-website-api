const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlayer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    englishName: Joi.string().allow(''),
    file: Joi.object().required(),
    mainHand: Joi.string().allow(''),
    position: Joi.string().required(),
    height: Joi.string().allow(''),
    birth: Joi.string().allow(''),
    backNumber: Joi.string().required(),
    teamId: Joi.string().custom(objectId).required(),
    active: Joi.string().required(),
  }),
};

const getPlayer = {
  params: Joi.object().keys({
    playerId: Joi.string().custom(objectId),
  }),
};

const getPlayers = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const getPlayersByTeam = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
    teamId: Joi.string().custom(objectId),
  }),
};

const updatePlayer = {
  params: Joi.object().keys({
    playerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      englishName: Joi.string().allow(''),
      file: Joi.object().required(),
      mainHand: Joi.string().allow(''),
      position: Joi.string().required(),
      height: Joi.string().allow(''),
      birth: Joi.string().allow(''),
      backNumber: Joi.string().required(),
      teamId: Joi.string().custom(objectId).required(),
      active: Joi.string().required(),
    })
    .min(1),
};

const deletePlayer = {
  params: Joi.object().keys({
    playerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPlayer,
  getPlayer,
  getPlayers,
  getPlayersByTeam,
  updatePlayer,
  deletePlayer,
};

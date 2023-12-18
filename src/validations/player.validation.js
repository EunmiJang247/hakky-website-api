const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlayer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    englishName: Joi.string().required(),
    file: Joi.object().required(),
    mainHand: Joi.string().required(),
    position: Joi.string().required(),
    height: Joi.string().required(),
    birth: Joi.string().required(),
    backNumber: Joi.string().required(),
    teamName: Joi.string().required(),
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

const updatePlayer = {
  params: Joi.object().keys({
    playerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      englishName: Joi.string().required(),
      file: Joi.object().required(),
      mainHand: Joi.string().required(),
      position: Joi.string().required(),
      height: Joi.string().required(),
      birth: Joi.string().required(),
      backNumber: Joi.string().required(),
      teamName: Joi.string().required(),
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
  updatePlayer,
  deletePlayer,
};

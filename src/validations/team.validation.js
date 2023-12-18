const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTeam = {
  body: Joi.object().keys({
    borrowTime: Joi.string().required(),
    chiefName: Joi.string().required(),
    name: Joi.string().required(),
    active: Joi.string().required(),
    file: Joi.object().required(),
  }),
};

const getTeam = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
  }),
};

const getTeams = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
  }),
};

const updateTeam = {
  params: Joi.object().keys({
    teamId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      borrowTime: Joi.string().required(),
      chiefName: Joi.string().required(),
      name: Joi.string().required(),
      active: Joi.string().required(),
      file: Joi.object().required(),
    })
    .min(1),
};

const deleteTeam = {
  params: Joi.object().keys({
    teamId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};

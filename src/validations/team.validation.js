const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTeam = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    file: Joi.object().required(),
    active: Joi.string().required(),
    viceChiefName: Joi.string().allow(''),
    place: Joi.string().allow(''),
    pd: Joi.string().allow(''),
    coach: Joi.string().allow(''),
    borrowTime: Joi.string().allow(''),
    chiefName: Joi.string().allow(''),
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
    searchParam: Joi.string().allow(''),
  }),
};

const updateTeam = {
  params: Joi.object().keys({
    teamId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      viceChiefName: Joi.string().allow(''),
      place: Joi.string().allow(''),
      pd: Joi.string().allow(''),
      coach: Joi.string().allow(''),
      borrowTime: Joi.string().allow(''),
      chiefName: Joi.string().allow(''),
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

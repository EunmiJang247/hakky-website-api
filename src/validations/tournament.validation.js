const Joi = require('joi');
// const { objectId } = require('./custom.validation');

const getTournaments = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    skip: Joi.number().required(),
    divisionId: Joi.string().required(),
  }),
};

module.exports = {
  getTournaments,
};

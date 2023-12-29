const Joi = require('joi');

const updateMainMenu = {
  body: Joi.array()
    .items(
      Joi.object({
        id: Joi.string(),
      }),
    )
    .required(),
};

module.exports = {
  updateMainMenu,
};

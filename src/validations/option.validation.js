const Joi = require('joi');

const createOption = {
  body: Joi.object()
    .keys({
      productId: Joi.string().required(),
      name: Joi.string().required(),
      time: Joi.number().required(),
      detail: Joi.string().required(),
      price: Joi.number().required(),
      setting: Joi.string().required(),
      isPrivateMenu: Joi.boolean(),
    })
    .required(),
};

const readOption = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

const updateOption = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      time: Joi.number(),
      detail: Joi.string(),
      price: Joi.number(),
      setting: Joi.string(),
      isPrivateMenu: Joi.boolean(),
      productId: Joi.string(),
    })
    .required(),
};

const updateOptionsOrder = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      options: Joi.array()
        .items(
          Joi.object({
            id: Joi.string(),
            name: Joi.string(),
            time: Joi.number(),
            detail: Joi.string(),
            price: Joi.number(),
            setting: Joi.string(),
            isPrivateMenu: Joi.boolean(),
            productId: Joi.string(),
          }),
        )
        .required(),
    })
    .required(),
};

const deleteOption = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createOption,
  readOption,
  deleteOption,
  updateOption,
  updateOptionsOrder,
};

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object()
    .keys({
      place: Joi.string().required(),
      name: Joi.string().required(),
      images: Joi.array().items(Joi.object()).required(),
      description: Joi.string().required(),
      options: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          time: Joi.string().required(),
          detail: Joi.string().required(),
          price: Joi.string().required(),
        }),
      ),
    })
    .required(),
};

const getProducts = {
  query: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      images: Joi.array().items(Joi.object()),
      description: Joi.string(),
      options: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          time: Joi.string(),
          detail: Joi.string(),
          price: Joi.string(),
        }),
      ),
    })
    .required(),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

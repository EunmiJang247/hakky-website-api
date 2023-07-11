const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const createOption = async (optionBody) => {
  const product = await Product.findById(optionBody.productId);
  product.options.push(optionBody);
  product.save();
  return product;
};

const readOption = async (productId, id) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const index = product.options.findIndex((item) => item.id === id);
  return product.options[index];
};

const updateOption = async (productId, id, updateBody) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const index = product.options.findIndex((item) => item.id === id);
  product.options[index] = updateBody;
  product.markModified('options');
  await product.save();
  return product;
};

const updateOptionsOrder = async (productId, updateBody) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.options = updateBody;
  product.markModified('options');
  await product.save();
  return product;
};

const deleteOptionById = async (productId, id) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const result = product.options.filter((item) => item.id !== id);
  product.options = result;
  product.markModified('options');
  product.save();
  return product;
};

module.exports = {
  createOption,
  readOption,
  updateOption,
  updateOptionsOrder,
  deleteOptionById,
};

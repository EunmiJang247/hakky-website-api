const httpStatus = require('http-status');
const { Product, PlaceIdle } = require('../models');
const ApiError = require('../utils/ApiError');

const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  product.options = [];
  product.save();
  const place = await PlaceIdle.Place.findById(productBody.place);
  place.product.push(product.id);
  place.save();
  return product;
};

const getProducts = async (placeId) => {
  const places = await Product.find({ place: placeId });
  return places;
};

const getProductById = async (id) => {
  const detailData = await Product.findById(id);
  return detailData;
};

const updateProduct = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  const place = await PlaceIdle.Place.findById(product.place);
  const newArr = place.product.filter((prod) => String(prod) !== String(productId));
  place.product = newArr;
  place.markModified('product');
  place.save();
  await product.remove();
  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProductById,
  updateProduct,
};

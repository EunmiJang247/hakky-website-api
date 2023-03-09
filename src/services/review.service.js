const httpStatus = require('http-status');
const { Review, Notice } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a review
 * @param {Object} reviewㅔ;ㅔㅔBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  return Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  const detailData = await Review.findById(id);
  const prevData = await Review.findOne({ createdAt: { $lt: detailData.createdAt } }).sort({ createdAt: -1 });
  const nextData = await Review.findOne({ createdAt: { $gt: detailData.createdAt } }).sort({ createdAt: 1 });
  return {
    ...detailData.toObject(),
    next: nextData && nextData._id,
    prev: prevData && prevData._id,
  };
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};

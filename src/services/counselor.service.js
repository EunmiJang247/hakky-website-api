const httpStatus = require('http-status');
const { Counselor } = require('../models');
const ApiError = require('../utils/ApiError');
const { preSignS3Object } = require('../utils/upload');

/**
 * Create a counselor
 * @param {Object} counselorBody
 * @returns {Promise<Counselor>}
 */
const createCounselor = async (counselorBody) => {
  return Counselor.create(counselorBody);
};

/**
 * Query for counselors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCounselors = async (filter, options) => {
  const counselors = await Counselor.paginate(filter, options);
  return counselors;
};

/**
 * Get counselor by id
 * @param {ObjectId} id
 * @returns {Promise<Counselor>}
 */
const getCounselorById = async (id) => {
  return Counselor.findById(id);
};

/**
 * Update counselor by id
 * @param {ObjectId} counselorId
 * @param {Object} updateBody
 * @returns {Promise<Counselor>}
 */
const updateCounselorById = async (counselorId, updateBody) => {
  const counselor = await getCounselorById(counselorId);
  if (!counselor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Counselor not found');
  }
  Object.assign(counselor, updateBody);
  await counselor.save();
  return counselor;
};

/**
 * Delete counselor by id
 * @param {ObjectId} counselorId
 * @returns {Promise<Counselor>}
 */
const deleteCounselorById = async (counselorId) => {
  const counselor = await getCounselorById(counselorId);
  if (!counselor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Counselor not found');
  }
  await counselor.remove();
  return counselor;
};

module.exports = {
  createCounselor,
  queryCounselors,
  getCounselorById,
  updateCounselorById,
  deleteCounselorById,
};

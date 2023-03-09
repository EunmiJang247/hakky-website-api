const httpStatus = require('http-status');
const { Notice } = require('../models');
const ApiError = require('../utils/ApiError');
const { noticeService } = require('./index');

/**
 * Create a notice
 * @param {Object} noticeBody
 * @returns {Promise<Notice>}
 */
const createNotice = async (noticeBody) => {
  return Notice.create(noticeBody);
};

/**
 * Query for notices
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotices = async (filter, options) => {
  const notices = await Notice.paginate(filter, options);
  return notices;
};

/**
 * Get notice by id
 * @param {ObjectId} id
 * @returns {Promise<Notice>}
 */
const getNoticeById = async (id) => {
  const detailData = await Notice.findById(id);
  const prevData = await Notice.findOne({ createdAt: { $lt: detailData.createdAt } }).sort({ createdAt: -1 });
  const nextData = await Notice.findOne({ createdAt: { $gt: detailData.createdAt } }).sort({ createdAt: 1 });
  return {
    ...detailData.toObject(),
    next: nextData && nextData._id,
    prev: prevData && prevData._id,
  };
};

/**
 * Update notice by id
 * @param {ObjectId} noticeId
 * @param {Object} updateBody
 * @returns {Promise<Notice>}
 */
const updateNoticeById = async (noticeId, updateBody) => {
  const notice = await getNoticeById(noticeId);
  if (!notice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  Object.assign(notice, updateBody);
  await notice.save();
  return notice;
};

/**
 * Delete notice by id
 * @param {ObjectId} noticeId
 * @returns {Promise<Notice>}
 */
const deleteNoticeById = async (noticeId) => {
  const notice = await getNoticeById(noticeId);
  if (!notice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  await notice.remove();
  return notice;
};

module.exports = {
  createNotice,
  queryNotices,
  getNoticeById,
  updateNoticeById,
  deleteNoticeById,
};

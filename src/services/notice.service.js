const httpStatus = require('http-status');
const { Notice } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a notice
 * @param {Object} noticeBody
 * @returns {Promise<Notice>}
 */
const createNotice = async (noticeBody) => {
  return Notice.create(noticeBody);
};

const queryNotices = async ({ limit, skip, important }) => {
  let notices;
  let count;
  if (important) {
    notices = await Notice.find().limit(limit).skip(skip);
    count = await Notice.countDocuments({ important: false });
  } else {
    notices = await Notice.find({ important: false }).limit(limit).skip(skip);
    count = await Notice.countDocuments({ important: false });
  }
  return {
    result: notices,
    count,
  };
};

const queryImportantNotices = async () => {
  const notices = await Notice.find({ isImportant: true });
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
  queryImportantNotices,
  getNoticeById,
  updateNoticeById,
  deleteNoticeById,
};

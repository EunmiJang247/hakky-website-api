const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { noticeService } = require('../services');

const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice(req.body);
  res.status(httpStatus.CREATED).send(notice);
});

const getNotices = catchAsync(async (req, res) => {
  const result = await noticeService.queryNotices({
    limit: req.query.limit,
    skip: req.query.skip,
    important: req.query.important,
    keyword: req.query.keyword,
  });

  res.send({
    result: result.result,
    totalCount: result.count,
  });
});

const getImportantNotices = catchAsync(async (req, res) => {
  const result = await noticeService.queryImportantNotices();
  res.send({ result });
});

const getNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.getNoticeById(req.params.noticeId);
  if (!notice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(notice);
});

const updateNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.updateNoticeById(req.params.noticeId, req.body);
  res.send(notice);
});

const deleteNotice = catchAsync(async (req, res) => {
  await noticeService.deleteNoticeById(req.params.noticeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotice,
  getNotices,
  getImportantNotices,
  getNotice,
  updateNotice,
  deleteNotice,
};

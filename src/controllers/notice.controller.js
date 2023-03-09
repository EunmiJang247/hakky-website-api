const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { noticeService } = require('../services');
const pick = require('../utils/pick');

const createNotice = catchAsync(async (req, res) => {
  const user = await noticeService.createNotice(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getNotices = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await noticeService.queryNotices(
    {
      title: {
        $regex: req.query.keyword,
      },
    },
    options
  );
  res.send(result);
});

const getNotice = catchAsync(async (req, res) => {
  const user = await noticeService.getNoticeById(req.params.noticeId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notice not found');
  }
  res.send(user);
});

const updateNotice = catchAsync(async (req, res) => {
  const user = await noticeService.updateNoticeById(req.params.noticeId, req.body);
  res.send(user);
});

const deleteNotice = catchAsync(async (req, res) => {
  await noticeService.deleteNoticeById(req.params.noticeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice,
};

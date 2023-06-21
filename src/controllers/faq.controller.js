const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { faqService } = require('../services');

const createFaq = catchAsync(async (req, res) => {
  const user = await faqService.createFaq(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getFaqs = catchAsync(async (req, res) => {
  const result = await faqService.queryFaqs();
  res.send(result);
});

const getFaq = catchAsync(async (req, res) => {
  const user = await faqService.getFaqById(req.params.faqId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  res.send(user);
});

const updateFaq = catchAsync(async (req, res) => {
  const user = await faqService.updateFaqById(req.params.faqId, req.body);
  res.send(user);
});

const deleteFaq = catchAsync(async (req, res) => {
  await faqService.deleteFaqById(req.params.faqId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFaq,
  getFaqs,
  getFaq,
  updateFaq,
  deleteFaq,
};

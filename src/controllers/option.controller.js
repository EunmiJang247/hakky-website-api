const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { optionService } = require('../services');

const createOption = catchAsync(async (req, res) => {
  const option = await optionService.createOption(req.body);
  res.status(httpStatus.CREATED).send(option);
});

const updateOption = catchAsync(async (req, res) => {
  const notice = await optionService.updateOption(req.params.productId, req.params.id, req.body);
  res.send(notice);
});

const updateOptionsOrder = catchAsync(async (req, res) => {
  const notice = await optionService.updateOptionsOrder(req.params.productId, req.body);
  res.send(notice);
});

const deleteOptionById = catchAsync(async (req, res) => {
  await optionService.deleteOptionById(req.params.productId, req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOption,
  updateOption,
  updateOptionsOrder,
  deleteOptionById,
};

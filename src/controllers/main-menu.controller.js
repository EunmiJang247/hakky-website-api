const catchAsync = require('../utils/catchAsync');
const { mainMenuService } = require('../services');

const getMainMenu = catchAsync(async (req, res) => {
  const result = await mainMenuService.queryMainMenu();
  res.send(result);
});

const updateMainMenu = catchAsync(async (req, res) => {
  const result = await mainMenuService.updateMainMenu(req.body);
  res.send(result);
});

module.exports = {
  getMainMenu,
  updateMainMenu,
};

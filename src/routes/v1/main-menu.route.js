const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const mainMenuController = require('../../controllers/main-menu.controller');
const { mainMenuValidation } = require('../../validations');

const router = express.Router();

router
  .route('/').get(mainMenuController.getMainMenu)
  .patch(auth('ADMIN'), validate(mainMenuValidation.updateMainMenu), mainMenuController.updateMainMenu);

module.exports = router;

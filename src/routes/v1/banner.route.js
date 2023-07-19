const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bannerValidation = require('../../validations/banner.validation');
const bannerController = require('../../controllers/banner.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('ADMIN'), bannerController.createBanner)
  .get(bannerController.getBanner)
  .patch(auth('' || 'ADMIN'), validate(bannerValidation.updateBanner), bannerController.updateBanner);

module.exports = router;

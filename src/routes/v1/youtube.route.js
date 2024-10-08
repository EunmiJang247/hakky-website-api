const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const youtubeValidation = require('../../validations/youtube.validation');
const youtubeController = require('../../controllers/youtube.controller');

const router = express.Router();

router.route('/').post(auth('ADMIN'), validate(youtubeValidation.createYoutube), youtubeController.createYoutube);
router.route('/').get(validate(youtubeValidation.getYoutubes), youtubeController.getYoutubes);
router.route('/main').get(validate(youtubeValidation.getYoutubes), youtubeController.getYoutubesMain);
router
  .route('/:youtubeId')
  .get(validate(youtubeValidation.getYoutube), youtubeController.getYoutube)
  .patch(auth('ADMIN'), validate(youtubeValidation.updateYoutube), youtubeController.updateYoutube)
  .delete(auth('ADMIN'), validate(youtubeValidation.getYoutube), youtubeController.deleteYoutube);

module.exports = router;

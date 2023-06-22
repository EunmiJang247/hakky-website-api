const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const placeValidation = require('../../validations/place.validation');
const placeController = require('../../controllers/place.controller');

const router = express.Router();

router.route('/').post(validate(placeValidation.createPlace), placeController.createPlace).get(placeController.getPlaces);
router
  .route('/:placeId/:month')
  .get(validate(placeValidation.getPlace), placeController.getPlace)
  .patch(auth('manageUsers'), validate(placeValidation.updatePlace), placeController.updatePlace)
  .delete(auth('manageUsers'), validate(placeValidation.deletePlace), placeController.deletePlace);

module.exports = router;

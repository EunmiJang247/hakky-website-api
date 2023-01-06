const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const popupValidation = require('../../validations/popup.validation');
const popupController = require('../../controllers/popup.controller');

const router = express.Router();

router.route('/').post(validate(popupValidation.createPopup), popupController.createPopup).get(popupController.getPopups);

router
  .route('/:popupId')
  .get(auth('manageUsers'), validate(popupValidation.getPopup), popupController.getPopup)
  .patch(auth('manageUsers'), validate(popupValidation.updatePopup), popupController.updatePopup)
  .delete(auth('manageUsers'), validate(popupValidation.deletePopup), popupController.deletePopup);

module.exports = router;

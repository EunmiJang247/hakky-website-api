const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const counselorValidation = require('../../validations/counselor.validation');
const counselorController = require('../../controllers/counselor.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(counselorValidation.createCounselor), counselorController.createCounselor)
  .get(counselorController.getCounselors);

router
  .route('/:counselorId')
  .get(validate(counselorValidation.getCounselor), counselorController.getCounselor)
  .patch(auth('manageUsers'), validate(counselorValidation.updateCounselor), counselorController.updateCounselor)
  .delete(auth('manageUsers'), validate(counselorValidation.deleteCounselor), counselorController.deleteCounselor);

module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const divisionValidation = require('../../validations/division.validation');
const divisionController = require('../../controllers/division.controller');

const router = express.Router();

router.route('/').post(auth('ADMIN'), validate(divisionValidation.createDivision), divisionController.createDivision);
router.route('/').get(validate(divisionValidation.getDivisions), divisionController.getDivisions);
router
  .route('/:divisionId')
  .get(validate(divisionValidation.getDivision), divisionController.getDivision)
  .patch(auth('ADMIN'), validate(divisionValidation.updateDivision), divisionController.updateDivision)
  .delete(auth('ADMIN'), validate(divisionValidation.deleteDivision), divisionController.deleteDivision);

module.exports = router;

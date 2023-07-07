const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const optionValidation = require('../../validations/option.validation');
const optionController = require('../../controllers/option.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(optionValidation.createOption), optionController.createOption);
router
  .route('/:productId/')
  .patch(auth('ADMIN'), validate(optionValidation.updateOptionsOrder), optionController.updateOptionsOrder);
router
  .route('/:productId/:optionId')
  .patch(auth('ADMIN'), validate(optionValidation.updateOption), optionController.updateOption)
  .delete(auth('ADMIN'), validate(optionValidation.deleteOption), optionController.deleteOptionById);

module.exports = router;

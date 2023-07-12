const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(paymentValidation.readOption), paymentController.readPayments)
  .post(validate(paymentValidation.createOption), paymentController.createPayment);
router
  .route('/:paymentId/')
  .get(validate(paymentValidation.updateOptionsOrder), paymentController.readPayment);

module.exports = router;

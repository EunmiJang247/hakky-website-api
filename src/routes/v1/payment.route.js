const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentValidation = require('../../validations/payment.validation');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router
  .route('/')
  .get(validate(paymentValidation.readPayments), paymentController.readPayments)
  .post(auth(), validate(paymentValidation.createPayment), paymentController.createPayment);

router
  .route('/subAdmin/')
  .get(validate(paymentValidation.subAdminReadPayments), paymentController.subAdminReadPayments);

router
  .route('/refund/:paymentId')
  .patch(auth('ADMIN'), validate(paymentValidation.refund), paymentController.refund);
router
  .route('/refundAndCancel/:paymentId')
  .patch(auth('ADMIN'), validate(paymentValidation.refund), paymentController.refundAndCancel);
router
  .route('/:paymentId/')
  .get(validate(paymentValidation.readPayment), paymentController.readPayment);

module.exports = router;

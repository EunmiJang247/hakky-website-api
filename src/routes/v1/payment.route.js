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

router.post('/webhook/', paymentController.tossDepositCallback);

router
  .route('/subAdmin/')
  .get(validate(paymentValidation.subAdminReadPayments), paymentController.subAdminReadPayments);
router
  .route('/statistic/')
  .get(validate(paymentValidation.statistic), paymentController.statistic);
router
  .route('/refund/user/:paymentId')
  .patch(auth(), validate(paymentValidation.refundAndCancel), paymentController.refundByUser);
router
  .route('/subAdmin/refund/:paymentId')
  .patch(auth('SUB_ADMIN'), validate(paymentValidation.refund), paymentController.refund);
router
  .route('/refund/:paymentId')
  .patch(auth('ADMIN'), validate(paymentValidation.refund), paymentController.refund);
router
  .route('/subAdmin/refundAndCancel/:paymentId')
  .patch(auth('SUB_ADMIN'), validate(paymentValidation.refundAndCancel), paymentController.refundAndCancel);
router
  .route('/refundAndCancel/:paymentId')
  .patch(auth('ADMIN'), validate(paymentValidation.refundAndCancel), paymentController.refundAndCancel);
router
  .route('/:paymentId/')
  .get(validate(paymentValidation.readPayment), paymentController.readPayment);

module.exports = router;

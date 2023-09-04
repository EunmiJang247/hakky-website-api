const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reservationValidation = require('../../validations/reservation.validation');
const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(reservationValidation.createReservation), reservationController.createReservation)
  .get(auth(), validate(reservationValidation.getReservations), reservationController.readReservations);
router
  .route('/admin/')
  .post(auth('ADMIN'), validate(reservationValidation.adminCreateReservation), reservationController.adminCreateReservation)
  .get(auth('ADMIN'), validate(reservationValidation.adminGetReservations), reservationController.adminReadReservations);
router
  .route('/subAdmin/')
  .get(auth('SUB_ADMIN'), validate(reservationValidation.subAdminGetReservations), reservationController.subAdminReadReservations)
  .post(auth('SUB_ADMIN'), validate(reservationValidation.subAdminCreateReservation), reservationController.subAdminCreateReservation);
router
  .route('/subAdmin/:reservationId')
  .get(auth('SUB_ADMIN'), validate(reservationValidation.getReservation), reservationController.adminReadReservation)
  .patch(auth('SUB_ADMIN'), validate(reservationValidation.updateReservation), reservationController.adminUdateReservation);
router
  .route('/admin/:reservationId')
  .get(auth('ADMIN'), validate(reservationValidation.getReservation), reservationController.adminReadReservation)
  .patch(auth('ADMIN'), validate(reservationValidation.updateReservation), reservationController.adminUdateReservation);
router
  .route('/:reservationId')
  .get(auth(), validate(reservationValidation.getReservation), reservationController.readReservation)
  .patch(auth(), validate(reservationValidation.updateReservation), reservationController.updateReservation);
// router
//   .route('/:reservationId/cancel')
//   .patch(auth(), validate(reservationValidation.cancelReservation), reservationController.cancelReservation);
router
  .route('/admin/:reservationId/cancel')
  .patch(auth('ADMIN'), validate(reservationValidation.cancelReservation), reservationController.adminCancelReservation);

module.exports = router;

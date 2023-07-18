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
  .route('/:reservationId')
  .get(auth(), validate(reservationValidation.getReservation), reservationController.readReservation)
  .patch(auth(), validate(reservationValidation.updateReservation), reservationController.updateReservation);
router
  .route('/admin/:reservaionId')
  .get(auth('ADMIN'), validate(reservationValidation.getReservation), reservationController.adminReadReservation)
  .patch(auth('ADMIN'), validate(reservationValidation.updateReservation), reservationController.adminReadReservations);
router
  .route('/:reservationId/cancel')
  .patch(auth(), validate(reservationValidation.cancelReservation), reservationController.cancelReservation);

module.exports = router;

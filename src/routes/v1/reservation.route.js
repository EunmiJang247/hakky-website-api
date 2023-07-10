const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reservationValidation = require('../../validations/reservation.validation');
const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(reservationValidation.createReservation), reservationController.createReservation)
  .get(validate(reservationValidation.getReservations), reservationController.readReservations);
router
  .route('/:reservationId')
  .get(validate(reservationValidation.getProduct), reservationController.readReservation)
  .patch(auth('ADMIN'), validate(reservationValidation.updateProduct), reservationController.updateReservation);
router
  .route('/:reservationId/cancel')
  .patch(validate(reservationValidation.cancelReservation), reservationController.cancelReservation);

module.exports = router;

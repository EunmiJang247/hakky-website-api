const httpStatus = require('http-status');
const { reservationService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(httpStatus.CREATED).send(reservation);
});

const readReservation = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.readReservation(req.params.id, userId);
  res.status(httpStatus.OK).send(reservation);
});

const readReservations = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.readReservations(req.query.status, userId);
  res.status(httpStatus.OK).send(reservation);
});

const updateReservation = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.updateReservation(req.params.id, userId);
  res.status(httpStatus.NO_CONTENT).send(reservation);
});

const cancelReservation = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.cancelReservation(req.params.id, userId);
  res.status(httpStatus.NO_CONTENT).send(reservation);
});

module.exports = {
  createReservation,
  readReservation,
  readReservations,
  updateReservation,
  cancelReservation,
};

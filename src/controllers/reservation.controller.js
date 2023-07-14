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

const adminReadReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminReadReservation(req.params.id);
  res.status(httpStatus.OK).send(reservation);
});

const readReservations = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.readReservations(req.query.status, userId);
  res.status(httpStatus.OK).send(reservation);
});

const adminReadReservations = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminReadReservations(req.query.applicant, req.query.placeId, req.query.from, req.query.to, req.query.limit, req.query.skip);
  res.send({ result: reservation.result, count: reservation.count });
});

const updateReservation = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const reservation = await reservationService.updateReservation(req.params.id, userId);
  res.status(httpStatus.NO_CONTENT).send(reservation);
});

const adminUdateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminUpdateReservation(req.params.id);
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
  adminReadReservation,
  adminReadReservations,
  adminUdateReservation,
  updateReservation,
  cancelReservation,
};

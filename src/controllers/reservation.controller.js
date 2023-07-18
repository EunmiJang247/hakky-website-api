const httpStatus = require('http-status');
const { reservationService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  const result = await reservationService.serializer(reservation);
  res.status(httpStatus.CREATED).send(result);
});

const adminCreateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminCreateReservation(req.body);
  const result = await Promise.all(reservation.result.map(reservationService.serializer));
  res.send({ result, count: reservation.count });
});

const readReservation = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const reservation = await reservationService.readReservation(req.params.reservationId, userId);
  const result = await reservationService.serializer(reservation);
  res.status(httpStatus.OK).send(result);
});

const adminReadReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminReadReservation(req.params.reservationId);
  const result = await reservationService.serializer(reservation);
  res.status(httpStatus.OK).send(result);
});

const readReservations = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const reservation = await reservationService.readReservations(req.query.status, userId);
  const result = await Promise.all(reservation.result.map(reservationService.serializer));
  res.status(httpStatus.OK).send({
    result, count: reservation.count,
  });
});

const adminReadReservations = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminReadReservations(req.query.applicant, req.query.placeId, req.query.from, req.query.to, req.query.limit, req.query.skip, req.query.isAdminCreate);
  const result = await Promise.all(reservation.result.map(reservationService.serializer));
  res.send({ result, count: reservation.count });
});

const updateReservation = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const reservation = await reservationService.updateReservation(req.params.reservationId, req.body, userId);
  const result = await reservationService.serializer(reservation);
  res.status(httpStatus.OK).send(result);
});

const adminUdateReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.adminUpdateReservation(req.params.reservationId, req.body);
  const result = await reservationService.serializer(reservation);
  res.status(httpStatus.NO_CONTENT).send(result);
});

const cancelReservation = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  await reservationService.cancelReservation(req.params.reservationId, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createReservation,
  readReservation,
  readReservations,
  adminCreateReservation,
  adminReadReservation,
  adminReadReservations,
  adminUdateReservation,
  updateReservation,
  cancelReservation,
};

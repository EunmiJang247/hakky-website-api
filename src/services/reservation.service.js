const httpStatus = require('http-status');
const { Reservation } = require('../models');
const ApiError = require('../utils/ApiError');

const createReservation = async (reservationBody) => {
  const reservation = await Reservation.create(reservationBody);
  return reservation;
};

const readReservation = async (id, userId) => {
  const reservation = await Reservation.findOne({ _id: id, applicant: userId });
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  return reservation;
};

const adminReadReservation = async (id) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  return reservation;
};

const readReservations = async (status, userId) => {
  const statusQuery = {
    all: {},
    beforeDeposit: { isApproval: false, isCanceld: false, applicant: userId },
    complete: { isApproval: true, isCanceld: false, applicant: userId },
    canceld: { isCanceld: true, applicant: userId },
    done: { reservationTo: { $lte: new Date() }, isCanceld: false, applicant: userId },
  };

  const reservations = await Reservation.find(statusQuery[status]).sort('-createdAt');
  const count = await Reservation.countDocuments(statusQuery[status]);

  return {
    result: reservations,
    count,
  };
};

const adminReadReservations = async (status) => {
  const statusQuery = {
    all: {},
    beforeDeposit: { isApproval: false, isCanceld: false },
    complete: { isApproval: true, isCanceld: false },
    canceld: { isCanceld: true },
    done: { reservationTo: { $lte: new Date() }, isCanceld: false },
  };

  const reservations = await Reservation.find(statusQuery[status]).sort('-createdAt');
  const count = await Reservation.countDocuments(statusQuery[status]);

  return {
    result: reservations,
    count,
  };
};

const updateReservation = async (id, updateBody, userId) => {
  const reservation = await Reservation.findOne({ _id: id, applicant: userId });
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  Object.assign(reservation, updateBody);
  reservation.save();
  return reservation;
};

const cancelReservation = async (id, userId) => {
  const reservation = await Reservation.findOne({ _id: id, applicant: userId });
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  reservation.isCanceld = true;
  reservation.save();
  return reservation;
};

module.exports = {
  createReservation,
  readReservation,
  readReservations,
  updateReservation,
  cancelReservation,
  adminReadReservation,
  adminReadReservations,
};

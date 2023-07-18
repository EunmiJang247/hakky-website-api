const httpStatus = require('http-status');
const {
  Reservation, Payment, PlaceIdle, User,
} = require('../models');
const ApiError = require('../utils/ApiError');

const createReservation = async (reservationBody, paymentId, userId) => {
  const today = new Date();

  const month = today.getUTCMonth();
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();

  const date = new Date(year, month, day);

  const reservation = await Reservation.create({
    applicant: userId,
    placeId: reservationBody.placeId,
    paymentId,
    products: reservationBody.products,
    reservationFrom: reservationBody.reservationFrom,
    reservationTo: reservationBody.reservationTo,
    reservationTime: reservationBody.reservationTime,
    reservationDate: date,
    note: reservationBody.note,
  });
  return reservation;
};

const adminCreateReservation = async (reservationBody) => {
  const today = new Date();

  const month = today.getUTCMonth();
  const day = today.getUTCDate();
  const year = today.getUTCFullYear();

  const date = new Date(year, month, day);

  const reservation = await Reservation.create({
    isAdminCreate: true,
    customerName: reservationBody.cusutomerName,
    phoneNumber: reservationBody.phoneNumber,
    placeId: reservationBody.placeId,
    products: reservationBody.products,
    reservationFrom: reservationBody.reservationFrom,
    reservationTo: reservationBody.reservationTo,
    reservationTime: reservationBody.reservationTime,
    reservationDate: date,
    note: reservationBody.note,
  });
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
    beforeDeposit: { isApproval: false, isCanceled: false, applicant: userId },
    complete: { isApproval: true, isCanceled: false, applicant: userId },
    canceled: { isCanceled: true, applicant: userId },
    done: { reservationTo: { $lte: new Date() }, isCanceled: false, applicant: userId },
  };

  const reservations = await Reservation.find(statusQuery[status]).sort('-createdAt');
  const count = await Reservation.countDocuments(statusQuery[status]);

  return {
    result: reservations,
    count,
  };
};

const adminReadReservations = async (applicant, placeId, from, to, limit, skip, isAdminCreate) => {
  const query = { isAdminCreate };
  if (applicant) {
    query.applicant = applicant;
  }
  if (placeId) {
    query.place = placeId;
  }
  if (from) {
    query.createdAt = { $gte: from };
  }
  if (to) {
    query.createdAt = { $lte: to };
  }
  if (from && to) {
    query.createdAt = { $gte: from, $lte: to };
  }
  if (applicant) {
    if (applicant !== '') {
      const users = await User.find({ name: { $regex: applicant } });
      const nameList = users.map((user) => user._id);
      query.applicant = { $in: nameList };
    }
  }
  const result = await Reservation.find(query).limit(limit).skip(skip);
  const count = await Reservation.countDocuments(query);
  return {
    result,
    count,
  };
};

const updateReservation = async (id, updateBody, userId) => {
  const reservation = await Reservation.findOne({ _id: id, applicant: userId });
  if (!reservation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reservation not found');
  }
  if (reservation.isChanged === true) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Reservation is already changed');
  }
  Object.assign(reservation, updateBody);
  reservation.isChanged = true;
  reservation.save();
  return reservation;
};

const adminUpdateReservation = async (id, updateBody) => {
  const reservation = await Reservation.findOne({ _id: id });
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
  reservation.isCanceled = true;
  reservation.save();
  return reservation;
};

const serializer = async (reserv) => {
  const payment = await Payment.findById(reserv.paymentId);
  const place = await PlaceIdle.Place.findById(reserv.placeId);
  const productNameList = [];
  await Promise.all(
    reserv.products.map(async (product) => {
      productNameList.push(`${product.name}::${product.options[0].name}`);
    }),
  );

  const now = new Date();
  let status;

  if (reserv.isApproval === false && reserv.isCanceled === false) {
    status = '입금전';
  } else if (reserv.isApproval === true && reserv.isCanceled === false) {
    status = '예약완료';
  } else if (reserv.isCanceled === true) {
    status = '예약취소';
  } else if (reserv.reservationTo < now && reserv.isCanceled === false) {
    status = '작업완료';
  }

  return {
    id: reserv._id,
    products: reserv.products,
    productNames: productNameList,
    placeId: reserv.placeId,
    placeName: place.name,
    authorName: place.author.name,
    price: payment.amount,
    deposit: payment.deposit,
    appointmentStartDate: reserv.reservationFrom,
    appointmentEndDate: reserv.reservationTo,
    depositDeadline: payment.depositDeadline,
    status,
    payment: {
      method: payment.method,
      bankName: payment.bankName,
      virtualAccount: payment.virtualAccount,
      virtualAccountOwner: payment.virtualAccountOwner,
      cashReceipt: payment.cashReceipt,
    },
    customerName: reserv.customerName,
    phoneNumber: reserv.phoneNumber,
    isAdminCreate: reserv.isAdminCreate,
    note: reserv.note,
    isChanged: reserv.isChanged,
    createdAt: reserv.createdAt,
  };
};

module.exports = {
  adminCreateReservation,
  createReservation,
  readReservation,
  readReservations,
  updateReservation,
  cancelReservation,
  adminReadReservation,
  adminReadReservations,
  adminUpdateReservation,
  serializer,
};

const { Payment, Reservation, Product } = require('../models');
const ApiError = require('../utils/ApiError');

const createPayment = async (paymentBody) => {
  let timecheck = 0;
  await Promise.all(paymentBody.products.map(async (product) => {
    const productDoc = await Product.findById(product.id);
    const index = productDoc.option.findIndex((item) => String(item._id) === String(product.option[0].id));
    const option = product.option[index];
    timecheck += option.time;
  }));

  if (timecheck !== paymentBody.reservationTime) {
    throw new ApiError(400, 'reservationTime is not valid');
  }

  const reservation = await Reservation.create({
    applicant: paymentBody.applicant,
    place: paymentBody.place,
    price: paymentBody.price,
    deposit: Math.floor(paymentBody.price / 2),
    products: paymentBody.products,
    reservationFrom: paymentBody.reservationFrom,
    reservationTo: paymentBody.reservationTo,
    reservationTime: paymentBody.reservationTime,
    note: paymentBody.note,
  });
  reservation.save();

  const payment = await Payment.create({
    applicant: paymentBody.applicant,
    refund: false,
    isDeposit: false,
    amount: paymentBody.price,
  });
  return payment;
};

const readPayment = async (id) => {
  const payment = await Payment.findById(id);
  return payment;
};

const readPayments = async (keywords, startDate, endDate, applicant, limit, skip) => {
  const query = {
    startAt: { $gt: startDate },
    endAt: { $lt: endDate },
  };

  if (applicant) {
    query.applicant = applicant;
  }
  if (keywords !== '') {
    query._id = { $regex: keywords };
  }

  const payments = await Payment.find(query).limit(limit).skip(skip);

  return payments;
};

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

const { Payment, Reservation } = require('../models');

const createPayment = async (paymentBody) => {
  // const reservation = await Reservation.create({

  // });

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

const readPayments = async (keyword, startDate, endDate, applicant) => {
  const query = {
    startAt: { $gt: startDate },
    endAt: { $lt: endDate },
  };

  if (applicant) {
    query.applicant = applicant;
  }
  const payments = await Payment.find(query);

  return payments;
  // if (keyword !== '') {
  //   payments = await Payment.find();
  // }
};

module.exports = {
  createPayment,
  readPayment,
  readPayments,
};

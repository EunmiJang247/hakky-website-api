const Payment = require('../models');

const createPayment = async (paymentBody) => Payment.create(paymentBody);

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

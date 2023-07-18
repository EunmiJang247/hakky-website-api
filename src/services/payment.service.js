const axios = require('axios');
const { Payment, Product, User } = require('../models');
const config = require('../config/config');

const chedckValidTime = async (products, reservTime) => {
  let timecheck = 0;
  await Promise.all(
    products.map(async (product) => {
      const productDoc = await Product.findById(product.id);
      const index = productDoc.options.findIndex((item) => String(item._id) === String(product.options[0].id));
      const option = productDoc.options[index];
      timecheck += option.time;
    }),
  );

  if (timecheck !== reservTime) {
    return false;
  }

  return true;
};

const checkValidAmount = async (products, amount) => {
  let amountcheck = 0;
  await Promise.all(
    products.map(async (product) => {
      const productDoc = await Product.findById(product.id);
      const index = productDoc.options.findIndex((item) => String(item._id) === String(product.options[0].id));
      const option = productDoc.options[index];
      amountcheck += option.price;
    }),
  );

  if (Math.floor(amountcheck / 2) !== amount) {
    return false;
  }

  return true;
};

const createPayment = async (paymentBody, userId, now) => {
  const payment = await Payment.create({
    applicant: userId,
    refund: false,
    isDeposit: false,
    amount: paymentBody.price,
    deposit: paymentBody.amount,
    paymentKey: paymentBody.paymentKey,
    orderId: paymentBody.orderId,
    depositDeadline: now.setDate(now.getDate() + 1),
  });

  return payment;
};

const readPayment = async (id) => {
  const payment = await Payment.findById(id);
  return payment;
};

const readPayments = async (keywords, startDate, endDate, applicant, limit, skip) => {
  const query = {
    createdAt: { $gte: startDate, $lte: endDate },
  };

  if (applicant) {
    if (applicant !== '') {
      const users = await User.find({ name: { $regex: applicant } });
      const nameList = users.map((user) => user._id);
      query.applicant = { $in: nameList };
    }
  }
  if (keywords) {
    if (keywords !== '') {
      query._id = { $regex: keywords };
    }
  }

  const payments = await Payment.find(query).limit(limit).skip(skip);

  return payments;
};

const tossVirtualAccountCreate = async (paymentDoc) => {
  try {
    const result = await axios({
      url: 'https://api.tosspayments.com/v1/payments/confirm',
      method: 'POST',
      data: {
        paymentKey: paymentDoc.paymentKey,
        orderId: paymentDoc.orderId,
        amount: parseInt(paymentDoc.deposit, 10),
      },
      headers: {
        Authorization: `Basic ${config.toss}`,
        'Content-type': 'application/json',
      },
    });
    const payment = await Payment.findById(paymentDoc._id);
    payment.method = result.data.method;
    payment.bankName = result.data.method;
    payment.virtualAccount = result.data.virtualAccount.accountNumber;
    payment.virtualAccountOwner = result.data.virtualAccount.customerName;
    payment.cashReceipt = !!result.data.cashReceipt;

    payment.save();

    return payment;
  } catch (err) {
    return err;
  }
};

module.exports = {
  checkValidAmount,
  chedckValidTime,
  createPayment,
  readPayment,
  readPayments,
  tossVirtualAccountCreate,
};

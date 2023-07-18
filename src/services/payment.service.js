const axios = require('axios');
const {
  Payment, Product, User, Reservation,
} = require('../models');
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
    isRefund: false,
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
  const query = {};
  if (startDate) {
    query.createdAt = { $gte: startDate };
  }
  if (endDate) {
    query.createdAt = { $lte: endDate };
  }
  if (startDate && endDate) {
    query.createdAt = { $gte: startDate, $lte: endDate };
  }
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
  const count = await Payment.countDocuments(query);
  return {
    result: payments,
    count,
  };
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

    const bankCode = {
      39: '경남은행',
      34: '광주은행',
      S8: '교보증권',
      12: '단위농협(지역농축협)',
      SE: '대신증권',
      SK: '메리츠증권',
      S5: '미래에셋증권',
      SM: '부국증권',
      32: '부산은행',
      S3: '삼성증권',
      45: '새마을금고',
      64: '산림조합',
      SN: '신영증권',
      S2: '신한금융투자',
      88: '신한은행',
      48: '신협',
      27: '씨티은행',
      20: '우리은행',
      71: '우체국예금보험',
      S0: '유안타증권',
      SJ: '유진투자증권',
      50: '저축은행중앙회',
      37: '전북은행',
      35: '제주은행',
      90: '카카오뱅크',
      SQ: '카카오페이증권',
      89: '키움증권',
      92: '토스뱅크',
      ST: '토스증권',
      SR: '펀드온라인코리아(한국포스증권)',
      SH: '하나금융투자',
      81: '하나은행',
      S9: '하이투자증권',
      S6: '한국투자증권',
      SG: '한화투자증권',
      SI: 'DB금융투자',
      31: 'DGB대구은행',
      '03': 'IBK기업은행',
      '06': 'KB국민은행',
      '02': 'KDB산업은행',
      SP: 'KTB투자증권(다올투자증권)',
      SO: 'LIG투자증권',
      11: 'NH농협은행',
      SL: 'NH투자증권',
      23: 'SC제일은행',
      '07': 'Sh수협은행',
      SD: 'SK증권',
    };
    const payment = await Payment.findById(paymentDoc._id);
    payment.method = result.data.method;
    payment.bankName = bankCode[result.data.virtualAccount.bankCode];
    payment.virtualAccount = result.data.virtualAccount.accountNumber;
    payment.virtualAccountOwner = result.data.virtualAccount.customerName;
    payment.cashReceipt = !!result.data.cashReceipt;

    payment.save();

    return payment;
  } catch (err) {
    return err;
  }
};

const serializer = async (payment) => {
  const reservation = await Reservation.findById(payment.reservationId);
  const applicant = await User.findById(payment.applicant);

  const productNameList = [];
  await Promise.all(
    reservation.products.map(async (product) => {
      productNameList.push(`${product.name}::${product.options[0].name}`);
    }),
  );
  return {
    id: payment._id,
    createdAt: payment.createdAt,
    deposit: payment.deposit,
    isDeposit: payment.isDeposit,
    isRefund: payment.isRefund,
    reservationId: payment.reservationId,
    reservationName: productNameList,
    applicantId: payment.applicant,
    applicantName: applicant.name,
  };
};

module.exports = {
  checkValidAmount,
  chedckValidTime,
  createPayment,
  readPayment,
  readPayments,
  serializer,
  tossVirtualAccountCreate,
};

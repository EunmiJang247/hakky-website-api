const axios = require('axios');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('./ApiError');
const { User } = require('../models');

const textReservation = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const msg = `[사진관 세바] \n안녕하세요 ${user.name}님! 예약하신 일자까지 한달 남으셨습니다!`;

  const year = reservation.reservationDate.getFullYear();
  const month = reservation.reservationDate.getMonth();
  const day = reservation.reservationDate.getDate();
  const hour = reservation.reservationDate.getHours();
  const minutes = reservation.reservationDate.getMinutes();

  const now = new Date();
  const sendDate = new Date(year, month - 1, day);

  try {
    if (now < sendDate) {
      const result = await axios.post('https://apis.aligo.in/send/',
        null,
        {
          headers: {
            'Content-Type': 'applicant/json',
          },
          params: {
            key: config.aligo.apiKey,
            user_id: config.aligo.userId,
            sender: config.aligo.phoneNumber,
            receiver: user.phoneNumber,
            rdate: `${year}${month}${day}`,
            rtime: `${hour}${minutes}`,
            msg,
            testmode_yn: 'N',
          },
        });
      if (result.data.result_code !== '1') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
      }
      // eslint-disable-next-line no-param-reassign
      payment.msgId = result.data.msg_id;
      await payment.save();

      return 1;
    }
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

const textReservationComplete = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const msg = `[사진관 세바] \n안녕하세요 ${user.name}님! ${reservation.reservationDate}에 신청하신 예약이 현재 입금대기중입니다. \n 발급받으신 가상계좌에 24시간 내로 입금을 완료해주시면 예약이 정상처리됩니다!`;

  try {
    const result = await axios.post('https://apis.aligo.in/send/',
      null,
      {
        headers: {
          'Content-Type': 'applicant/json',
        },
        params: {
          key: config.aligo.apiKey,
          user_id: config.aligo.userId,
          sender: config.aligo.phoneNumber,
          receiver: user.phoneNumber,
          msg,
          testmode_yn: 'N',
        },
      });
    if (result.data.result_code !== '1') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
    }
    // eslint-disable-next-line no-param-reassign
    payment.msgId = result.data.msg_id;
    await payment.save();

    return 1;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

const textDepositComplete = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const msg = `[사진관 세바] \n안녕하세요 ${user.name}님! ${reservation.reservationDate}에 신청하신 예약이 현재 입금완료 처리되었습니다.`;

  try {
    const result = await axios.post('https://apis.aligo.in/send/',
      null,
      {
        headers: {
          'Content-Type': 'applicant/json',
        },
        params: {
          key: config.aligo.apiKey,
          user_id: config.aligo.userId,
          sender: config.aligo.phoneNumber,
          receiver: user.phoneNumber,
          msg,
          testmode_yn: 'N',
        },
      });
    if (result.data.result_code !== '1') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
    }
    // eslint-disable-next-line no-param-reassign
    payment.msgId = result.data.msg_id;
    await payment.save();

    return 1;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

const textCanceled = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const msg = `[사진관 세바] \n안녕하세요 ${user.name}님! ${reservation.reservationDate}에 신청하신 예약이 현재 취소 처리되었습니다.`;

  try {
    const cancel = await axios.post('https://apis.aligo.in/cancel/',
      null,
      {
        headers: {
          'Content-Type': 'applicant/json',
        },
        params: {
          key: config.aligo.apiKey,
          user_id: config.aligo.userId,
          mid: payment.msgId,
        },
      });
    if (cancel.data.result_code !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, cancel.data.message);
    }
    const result = await axios.post('https://apis.aligo.in/send/',
      null,
      {
        headers: {
          'Content-Type': 'applicant/json',
        },
        params: {
          key: config.aligo.apiKey,
          user_id: config.aligo.userId,
          sender: config.aligo.phoneNumber,
          receiver: user.phoneNumber,
          msg,
          testmode_yn: 'N',
        },
      });
    if (result.data.result_code !== '1') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
    }
    // eslint-disable-next-line no-param-reassign
    payment.msgId = result.data.msg_id;
    await payment.save();

    return 1;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

module.exports = {
  textReservation,
  textReservationComplete,
  textDepositComplete,
  textCanceled,
};

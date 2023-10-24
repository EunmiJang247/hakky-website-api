const axios = require('axios');
const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('./ApiError');
const { User } = require('../models');

const amPm = (hour) => {
  if (hour === 12) {
    return `오후${hour}시`;
  }

  return hour < 13 ? `오전${hour}시` : `오후${hour - 12}시`;
};
const hourAndMinutes = (hours, minutes) => (minutes < 30 ? `${hours}` : `${hours}${minutes}분`);

const dateUtil = (from, to) => {
  const fromYear = from.getFullYear();
  const fromMonth = from.getMonth() + 1;
  const fromDate = from.getDate();
  const fromHour = from.getHours() + 9;
  const fromHourUtil = amPm(fromHour);
  const fromMinutes = from.getMinutes();
  const fromHoursAndMinutes = hourAndMinutes(fromHourUtil, fromMinutes);
  const fromDayOfWeek = from.getDay();

  to.setMinutes(to.getMinutes() + 30);
  const toHour = to.getHours() + 9;
  const toHourUtil = amPm(toHour);
  const toMinutes = to.getMinutes();
  const toHoursAndMinutes = hourAndMinutes(toHourUtil, toMinutes);
  to.setMinutes(to.getMinutes() - 30);
  const dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  return `${fromYear}년 ${fromMonth}월 ${fromDate}일 ${dayOfWeek[fromDayOfWeek]} ${fromHoursAndMinutes} ~ ${toHoursAndMinutes}`;
};

const productNameList = (products) => {
  let names = '';
  products.forEach((product) => {
    names += `${product.name}(${product.options[0].name})\n`;
  });

  return names;
};

const remindReservation = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const date = dateUtil(reservation.reservationFrom, reservation.reservationTo);
  const productNames = productNameList(reservation.products);
  const msg = `[사진관, 세바 (${reservation.placeName}) 예약확인]\n\n
  ${user.name}님\n
  일시. ${date}\n
  촬영상품. \n
  ${productNames}\n
  총 ${payment.amount.toLocaleString('ko-KR')}원 중 ${payment.deposit.toLocaleString('ko-KR')}원 입금 확인되었습니다.\n\n
  예정되어 있는 촬영일 기준 한 달 전입니다.\n
  예약하신 날 뵐께요 :)\n\n
  [예약 완료하신 분들 필독사항]\n
  안내를 미숙지하여 발생하는 모든 사항은 책임지지 않습니다.\n
  *변경시, 개인사정에 의한 촬영일정변경은 촬영 2주(14일)전, 1회만 가능합니다.\n
  *취소시, 촬영일 기준 1주(7일) 이전까지는 전액 환불 가능하며, 그 이후에는 어떠한 경우에도 환불이 불가능합니다.\n
  *예약하신 이후 상품변경(일부상품변경, 컷수변경 포함)은 불가합니다. 상품변경을 희망하시는 경우 전체취소하시고 새롭게 예약해주셔야 합니다.\n
  *예약하신 날짜와 시간을 잘 체크하시고 당일날 찾아주세요.\n
  *각 지점에 따라 주차환경이 다르니, 미리 체크해주시기 바랍니다.\n
  *예약은 서로간의 약속입니다. 공간이 작은 관계로 너무 빨리 오시지 마시고, 예약시간에 맞춰 도착해주세요. 15분 이상 늦으시면 노쇼처리되며, 예약금은 환불되지 않습니다. \n
  *고객님이 예약하신 시간은 촬영,셀렉,리터칭,인화(가족사진의 경우 액자제작 포함)까지의 총 시간입니다.\n
  *위의 내용 외에 문의 내용이 있으실 경우에는 채널톡, 또는 예약하신 지점의 인스타그램 DM을 통해 문의주시기 바랍니다.`;

  const year = reservation.reservationDate.getFullYear();
  let month = reservation.reservationDate.getMonth() + 1;
  let day = reservation.reservationDate.getDate();
  const hour = reservation.reservationDate.getHours();
  const minutes = reservation.reservationDate.getMinutes();

  const now = new Date();
  if (month < 9) month = String(`0${month}`);
  if (day < 9) day = String(`0${day}`);

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
  const date = dateUtil(reservation.reservationFrom, reservation.reservationTo);
  const productNames = productNameList(reservation.products);
  const msg = `[사진관, 세바 (${reservation.placeName}) 예약안내]\n\n
  ${user.name}님\n
  일시. ${date}\n
  촬영상품. \n
  ${productNames}\n
  촬영금액. ${payment.amount.toLocaleString('ko-KR')}원\n
  예약금 50% 입금 확인 후 예약이 완료됩니다. (예약자 이름으로 입금해주세요.)\n\n
  입금계좌: ${payment.bankName} ${payment.virtualAccount} 주식회사 세바\n\n
  *24시간 이내에 입금확인이 되지 않으면 예약이 자동취소됩니다.\n
  *변경시, 개인사정에 의한 촬영일정변경은 촬영 2주(14일) 전, 1회만 가능합니다.\n
  *취소시, 촬영일 기준 1주(7일) 이전까지는 전액 환불 가능하며, 그 이후에는 어떠한 경우에도 환불이 불가능하니 신중히 예약해주세요.\n
  *예약하신 이후 상품변경(일부상품변경/추가, 컷수변경/추가 포함)은 불가합니다. 상품변경을 희망하시는 경우 이전 예약을 전체취소하시고 새롭게 예약해주셔야 합니다.`;

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
  const date = dateUtil(reservation.reservationFrom, reservation.reservationTo);
  const productNames = productNameList(reservation.products);
  const msg = `[사진관, 세바 (${reservation.placeName}) 예약확인]\n\n
  ${user.name}님\n
  일시. ${date}\n
  촬영상품. \n
  ${productNames}\n
  총 ${payment.amount.toLocaleString('ko-KR')}원 중 ${payment.deposit.toLocaleString('ko-KR')}원 입금 확인되었습니다.\n\n
  [예약 완료하신 분들 필독사항]\n
  안내를 미숙지하여 발생하는 모든 사항은 책임지지 않습니다.\n
  *변경시, 개인사정에 의한 촬영일정변경은 촬영 2주(14일)전, 1회만 가능합니다.\n
  *취소시, 촬영일 기준 1주(7일) 이전까지는 전액 환불 가능하며, 그 이후에는 어떠한 경우에도 환불이 불가능합니다.\n
  *예약하신 이후 상품변경(일부상품변경, 컷수변경 포함)은 불가합니다. 상품변경을 희망하시는 경우 전체취소하시고 새롭게 예약해주셔야 합니다.\n
  *예약하신 날짜와 시간을 잘 체크하시고 당일날 찾아주세요.\n
  *각 지점에 따라 주차환경이 다르니, 미리 체크해주시기 바랍니다.\n
  *예약은 서로간의 약속입니다. 공간이 작은 관계로 너무 빨리 오시지 마시고, 예약시간에 맞춰 도착해주세요. 15분 이상 늦으시면 노쇼처리되며, 예약금은 환불되지 않습니다. \n
  *고객님이 예약하신 시간은 촬영,셀렉,리터칭,인화(가족사진의 경우 액자제작 포함)까지의 총 시간입니다.\n
  *위의 내용 외에 문의 내용이 있으실 경우에는 채널톡, 또는 예약하신 지점의 인스타그램 DM을 통해 문의주시기 바랍니다.`;

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
    // eslint-disable-next-line no-console
    console.log(err);
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

const textCanceled = async (payment, reservation) => {
  const user = await User.findById(payment.applicant);
  const date = dateUtil(reservation.reservationFrom, reservation.reservationTo);
  const productNames = productNameList(reservation.products);
  const msg = `[사진관, 세바 (${reservation.placeName}) 예약취소]\n\n
  ${user.name}님\n
  일시. ${date}\n
  촬영상품. \n
  ${productNames}\n\n

  위 내용의 촬영 예약건이 고객님의 사정에의하여 취소되었습니다.
  총 ${payment.amount.toLocaleString('ko-KR')}원 중 예약 목적으로 입금하셨던\n
  선수금 ${payment.deposit.toLocaleString('ko-KR')}원이 고객님께서 신청하신 환불계좌로 입금 될 것 입니다.\n
  정상적으로 환불처리가 진행되지 않을 시에 채널톡, 또는 예약하신 지점으로 문의주시기 바랍니다.`;

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
    if (payment.msgId) {
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
        // eslint-disable-next-line no-console
        console.log(cancel.data.message);
      }
    }
    // eslint-disable-next-line no-param-reassign
    payment.msgId = result.data.msg_id;
    await payment.save();

    return 1;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    // throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

module.exports = {
  remindReservation,
  textReservationComplete,
  textDepositComplete,
  textCanceled,
};

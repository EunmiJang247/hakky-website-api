const httpStatus = require('http-status');
const axios = require('axios');
const { AuthCode } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const generateAuthCode = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getAuthCodeByIdentifier = async (identifier, phoneNumber) => {
  const authCode = await AuthCode.findOne({ identifier, phoneNumber });
  const now = new Date();
  if (!authCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect phoneNumber or identifier');
  }
  if (authCode.validTo < now) {
    await authCode.delete();
    throw new ApiError(httpStatus.BAD_REQUEST, 'code valid time is expired');
  }
  return authCode;
};

const createAuthCodeByPhoneNumber = async (phoneNumber) => {
  const identifier = generateAuthCode(100000, 999999);
  const msg = `[사진관 세바] 인증번호 \n[${identifier}] 입력해주세요.`;
  try {
    const result = await axios.post(config.aligo.url,
      null,
      {
        headers: {
          'Content-Type': 'applicant/json',
        },
        params: {
          key: config.aligo.apiKey,
          user_id: config.aligo.userId,
          sender: config.aligo.phoneNumber,
          receiver: phoneNumber,
          msg,
          testmode_yn: 'Y',
        },
      });
    if (result.data.result_code !== '1') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    const authCode = await AuthCode.create({ identifier, phoneNumber, validTo: now });
    return authCode;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

module.exports = {
  getAuthCodeByIdentifier,
  createAuthCodeByPhoneNumber,
};

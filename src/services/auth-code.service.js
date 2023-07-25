const httpStatus = require('http-status');
const axios = require('axios');
const AuthCode = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

const generateAuthCode = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getAuthCodeByIdentifier = async (identifier, phoneNumber) => {
  const authCode = await AuthCode.findOne({ identifier, phoneNumber });
  if (!authCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect phoneNumber or identifier');
  }
  return true;
};

const createAuthCodeByPhoneNumber = async (phoneNumber) => {
  const identifier = generateAuthCode(100000, 999999);
  const msg = `[사진관 세바] 인증번호 \n[${identifier}] 입력해주세요.`;
  try {
    const result = await axios.post(config.aligo.url, {
      key: config.aligo.apiKey,
      user_id: config.aligo.userId,
      sender: config.aligo.phoneNumber,
      receiver: phoneNumber,
      msg,
      testmode_yn: 'Y',
    });
    if (result.data.result_code !== '1') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect phoneNumber');
    }
    const authCode = await AuthCode.create({ identifier, phoneNumber });
    return authCode;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, err);
  }
};

module.exports = {
  getAuthCodeByIdentifier,
  createAuthCodeByPhoneNumber,
};

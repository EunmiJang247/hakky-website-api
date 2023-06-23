const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // todo auth code check
  const check = await User.findOne({ phoneNumber: userBody.phoneNumber });

  if (check) {
    throw new ApiError(httpStatus.UNAUTHORIZED, '이미 가입이 완료된 핸드폰 번호입니다.');
  }

  const user = await User.create({
    name: userBody.name,
    phoneNumber: userBody.phoneNumber,
    password: userBody.password,
    role: 'user',
    termsOfService: true,
    privacyPolicy: true,
  });
  return user;
};

const createUserNaver = async (userBody) => {
  const check = await User.findOne({ phoneNumber: userBody.response.mobile });

  if (check) {
    return check;
  }

  const user = await User.create({
    name: userBody.response.name,
    phoneNumber: userBody.response.mobile,
    role: 'user',
    termsOfService: true,
    privacyPolicy: true,
    isNaver: true,
  });
  return user;
};

const queryUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 * Get user by email
 * @param {string} phoneNumber
 * @returns {Promise<User>}
 */
const getUserByPhoneNumber = async (phoneNumber) => User.findOne({ phoneNumber });

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.phoneNumber && (await User.isPhoneNumberTaken(updateBody.phoneNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'phoneNumber already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  createUserNaver,
  queryUsers,
  getUserById,
  getUserByPhoneNumber,
  updateUserById,
  deleteUserById,
};

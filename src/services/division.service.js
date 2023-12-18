const httpStatus = require('http-status');
const { Division } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a team
 * @param {Object} teamBody
 * @returns {Promise<Team>}
 */
const createDivision = async (teamBody) => Division.create(teamBody);
const queryDivisions = async ({ limit, skip }) => {
  const divisions = await Division.find().limit(limit).skip(skip);
  const count = await Division.countDocuments();
  return {
    result: divisions,
    count,
  };
};

/**
 * Get faq by id
 * @param {ObjectId} id
 * @returns {Promise<Faq>}
 */
const getDivisionById = async (id) => Division.findById(id);

/**
 * Update faq by id
 * @param {ObjectId} faqId
 * @param {Object} updateBody
 * @returns {Promise<Faq>}
 */
const updateDivisionById = async (divisionId, updateBody) => {
  const division = await getDivisionById(divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division not found');
  }
  Object.assign(division, updateBody);
  await division.save();
  return division;
};

/**
 * Delete faq by id
 * @param {ObjectId} divisionId
 * @returns {Promise<Faq>}
 */

const deleteDivisionById = async (divisionId) => {
  const team = await getDivisionById(divisionId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'division not found');
  }
  await team.remove();
  return team;
};

module.exports = {
  createDivision,
  queryDivisions,
  getDivisionById,
  updateDivisionById,
  deleteDivisionById,
};

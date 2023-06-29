const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createIncludeSchedule = {
  body: Joi.object()
    .keys({
      place: Joi.string().required(),
      name: Joi.string().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
    })
    .required(),
};

const getIncludeSchedules = {
  query: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getIncludeSchedule = {
  params: Joi.object().keys({
    includeScheduleId: Joi.string().custom(objectId),
  }),
};

const updateIncludeSchedule = {
  params: Joi.object().keys({
    includeScheduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
    })
    .required(),
};

const deleteIncludeSchedule = {
  params: Joi.object().keys({
    includeScheduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createIncludeSchedule,
  getIncludeSchedules,
  getIncludeSchedule,
  updateIncludeSchedule,
  deleteIncludeSchedule,
};
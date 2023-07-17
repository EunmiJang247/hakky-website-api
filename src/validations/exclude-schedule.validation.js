const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createExcludeSchedule = {
  body: Joi.object()
    .keys({
      place: Joi.string().required(),
      name: Joi.string().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
    })
    .required(),
};

const getExcludeSchedules = {
  query: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getExcludeSchedule = {
  params: Joi.object().keys({
    excludeScheduleId: Joi.string().custom(objectId),
  }),
};

const updateExcludeSchedule = {
  params: Joi.object().keys({
    excludeScheduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      startAt: Joi.date(),
      endAt: Joi.date(),
    })
    .required(),
};

const deleteExcludeSchedule = {
  params: Joi.object().keys({
    excludeScheduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createExcludeSchedule,
  getExcludeSchedule,
  getExcludeSchedules,
  updateExcludeSchedule,
  deleteExcludeSchedule,
};

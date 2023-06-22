const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSchedule = {
  body: Joi.object()
    .keys({
      place: Joi.string().required(),
      name: Joi.string().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
      term: Joi.object().keys({
        mon: Joi.string().required(),
        tue: Joi.string().required(),
        wed: Joi.string().required(),
        thu: Joi.string().required(),
        fri: Joi.string().required(),
        sat: Joi.string().required(),
        sun: Joi.string().required(),
      }),
    })
    .required(),
};

const getSchedules = {
  query: Joi.object().keys({
    placeId: Joi.string().custom(objectId),
  }),
};

const getSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
  }),
};

const updateSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      startAt: Joi.date().required(),
      endAt: Joi.date().required(),
      term: Joi.object().keys({
        mon: Joi.string().required(),
        tue: Joi.string().required(),
        wed: Joi.string().required(),
        thu: Joi.string().required(),
        fri: Joi.string().required(),
        sat: Joi.string().required(),
        sun: Joi.string().required(),
      }),
    })
    .required(),
};

const deleteSchedule = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};

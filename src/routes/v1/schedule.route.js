const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const scheduleValidation = require('../../validations/schedule.validation');
const scheduleController = require('../../controllers/schedule.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(scheduleValidation.createSchedule), scheduleController.createSchedule)
  .get(validate(scheduleValidation.getSchedules), scheduleController.getSchedules);
router
  .route('/:scheduleId')
  .get(validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .patch(auth('manageUsers'), validate(scheduleValidation.updateSchedule), scheduleController.updateSchedule)
  .delete(auth('manageUsers'), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);

module.exports = router;

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
  .route('/subAdmin/:scheduleId')
  .patch(auth('SUB_ADMIN'), validate(scheduleValidation.updateSchedule), scheduleController.updateSchedule)
  .delete(auth('SUB_ADMIN'), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);
router
  .route('/:scheduleId')
  .get(validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .patch(auth('ADMIN'), validate(scheduleValidation.updateSchedule), scheduleController.updateSchedule)
  .delete(auth('ADMIN'), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);

module.exports = router;

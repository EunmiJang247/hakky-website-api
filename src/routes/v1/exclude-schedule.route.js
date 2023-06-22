const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const excludeScheduleValidation = require('../../validations/exclude-schedule.validation');
const excludeScheduleController = require('../../controllers/exclude-schedule.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(excludeScheduleValidation.createExcludeSchedule), excludeScheduleController.createExcludeSchedule)
  .get(validate(excludeScheduleValidation.getExcludeSchedules), excludeScheduleController.getExcludeSchedules);
router
  .route('/:excludeScheduleId')
  .get(validate(excludeScheduleValidation.getExcludeSchedule), excludeScheduleController.getExcludeSchedule)
  .patch(
    auth('ADMIN'),
    validate(excludeScheduleValidation.updateExcludeSchedule),
    excludeScheduleController.updateExcludeSchedule
  )
  .delete(
    auth('ADMIN'),
    validate(excludeScheduleValidation.deleteExcludeSchedule),
    excludeScheduleController.deleteExcludeSchedule
  );

module.exports = router;

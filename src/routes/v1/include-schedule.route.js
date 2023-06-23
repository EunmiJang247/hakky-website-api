const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const includeScheduleValidation = require('../../validations/include-schedule.validation');
const includeScheduleController = require('../../controllers/include-schedule.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(includeScheduleValidation.createIncludeSchedule), includeScheduleController.createIncludeSchedule)
  .get(validate(includeScheduleValidation.getIncludeSchedules), includeScheduleController.getIncludeSchedules);
router
  .route('/:includeScheduleId')
  .get(validate(includeScheduleValidation.getIncludeSchedule), includeScheduleController.getIncludeSchedule)
  .patch(
    auth('ADMIN'),
    validate(includeScheduleValidation.updateIncludeSchedule),
    includeScheduleController.updateIncludeSchedule,
  )
  .delete(
    auth('ADMIN'),
    validate(includeScheduleValidation.deleteIncludeSchedule),
    includeScheduleController.deleteIncludeSchedule,
  );

module.exports = router;

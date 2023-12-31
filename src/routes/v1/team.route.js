const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teamValidation = require('../../validations/team.validation');
const teamController = require('../../controllers/team.controller');

const router = express.Router();

router.route('/').post(validate(teamValidation.createTeam), teamController.createTeam)
  .get(validate(teamValidation.getTeams), teamController.getTeams);
router.route('/active').get(teamController.getActiveTeams);
router
  .route('/yearly-score/:teamId')
  .get(validate(teamValidation.getTeam), teamController.getTeamYearlyScore);

router
  .route('/players/:teamId')
  .get(validate(teamValidation.getTeam), teamController.getTeamPlayers);

router
  .route('/:teamId')
  .get(validate(teamValidation.getTeam), teamController.getTeam)
  .patch(auth('ADMIN'), validate(teamValidation.updateTeam), teamController.updateTeam)
  .delete(auth('ADMIN'), validate(teamValidation.deleteTeam), teamController.deleteTeam);

module.exports = router;

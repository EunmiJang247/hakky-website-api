const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const leagueValidation = require('../../validations/league.validation');
const leagueController = require('../../controllers/league.controller');

const router = express.Router();

router.route('/').post(validate(leagueValidation.createLeague), leagueController.createLeague);
router.route('/').get(validate(leagueValidation.getLeagues), leagueController.getLeagues);
router.route('/active').get(leagueController.getActiveLeagues);

router.route('/regulation/:leagueId').get(validate(leagueValidation.createLeague), leagueController.getRegulation);

router
  .route('/:leagueId')
  .get(validate(leagueValidation.getLeague), leagueController.getLeague)
  .patch(auth('ADMIN'), validate(leagueValidation.updateLeague), leagueController.updateLeague)
  .delete(auth('ADMIN'), validate(leagueValidation.deleteLeague), leagueController.deleteLeague);

module.exports = router;

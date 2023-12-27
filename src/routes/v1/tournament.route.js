const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tournamentValidation = require('../../validations/tournament.validation');
const tournamentController = require('../../controllers/tournament.controller');

const router = express.Router();

router.route('/').post(auth('ADMIN'), validate(tournamentValidation.createTournaments), tournamentController.createTournaments);
router.route('/').get(validate(tournamentValidation.getTournaments), tournamentController.getTournaments);
router.route('/calendar').get(validate(tournamentValidation.getTournamentsCalendar), tournamentController.getTournamentsCalendar);
router
  .route('/:tournamentId')
  .get(auth('ADMIN'), validate(tournamentValidation.getTournament), tournamentController.getTournament)
  .patch(auth('ADMIN'), validate(tournamentValidation.updateTournament), tournamentController.updateTournament)
  .delete(auth('ADMIN'), validate(tournamentValidation.deleteTournaments), tournamentController.deleteTournament);

module.exports = router;

const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tournamentValidation = require('../../validations/tournament.validation');
const tournamentController = require('../../controllers/tournament.controller');

const router = express.Router();

// router.route('/').post(auth('ADMIN'), validate(tournamentValidation.getTournaments), tournamentController.getTournaments);
router.route('/').get(validate(tournamentValidation.getTournaments), tournamentController.getTournaments);
// router
//   .route('/:tournamentId')
//   .get(auth('ADMIN'), validate(tournamentValidation.getTournaments), tournamentController.getTournaments)
//   .patch(auth('ADMIN'), validate(tournamentValidation.getTournaments), tournamentController.getTournaments)
//   .delete(auth('ADMIN'), validate(tournamentValidation.getTournaments), tournamentController.getTournaments);

module.exports = router;

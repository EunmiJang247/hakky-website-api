const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const playerValidation = require('../../validations/player.validation');
const playerController = require('../../controllers/player.controller');

const router = express.Router();

router.route('/').post(validate(playerValidation.createPlayer), playerController.createPlayer);
router.route('/').get(validate(playerValidation.getPlayers), playerController.getPlayers);
router.route('/active').get(playerController.getActivePlayers);
router
  .route('/:playerId')
  .get(auth('ADMIN'), validate(playerValidation.getPlayer), playerController.getPlayer)
  .patch(auth('ADMIN'), validate(playerValidation.updatePlayer), playerController.updatePlayer)
  .delete(auth('ADMIN'), validate(playerValidation.deletePlayer), playerController.deletePlayer);

module.exports = router;

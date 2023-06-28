const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const portFolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');

const router = express.Router();

router.route('/').post(validate(portFolioValidation.createPortfolio), portfolioController.createPlace).get(portfolioController.getPlaces);
router
  .route('/:portfolioId/')
  .get(validate(portFolioValidation.readPortfolio), portfolioController.getPlace)
  .patch(auth('manageUsers'), validate(portFolioValidation.updatePortfolio), portfolioController.updatePlace)
  .delete(auth('manageUsers'), validate(portFolioValidation.deletePortFolio), portfolioController.deletePlace);

module.exports = router;

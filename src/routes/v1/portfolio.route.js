const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const portFolioValidation = require('../../validations/portfolio.validation');
const portfolioController = require('../../controllers/portfolio.controller');

const router = express.Router();

router.route('/').post(validate(portFolioValidation.createPortfolio), portfolioController.createPortfolio).get(validate(portFolioValidation.readPortfolios), portfolioController.getPortfolios);
router
  .route('/:portfolioId/')
  .get(validate(portFolioValidation.readPortfolio), portfolioController.getPortfolio)
  .patch(auth('manageUsers'), validate(portFolioValidation.updatePortfolio), portfolioController.updatePortfolio)
  .delete(auth('manageUsers'), validate(portFolioValidation.deletePortFolio), portfolioController.deletePortfolio);

module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const faqValidation = require('../../validations/faq.validation');
const faqController = require('../../controllers/faq.controller');

const router = express.Router();

router.route('/').post(validate(faqValidation.createFaq), faqController.createFaq);
router.route('/').get(faqController.getFaqs);
router
  .route('/:faqId')
  .get(auth('ADMIN'), validate(faqValidation.getFaq), faqController.getFaq)
  .patch(auth('ADMIN'), validate(faqValidation.updateFaq), faqController.updateFaq)
  .delete(auth('ADMIN'), validate(faqValidation.deleteFaq), faqController.deleteFaq);

module.exports = router;

const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(reviewValidation.createReview), reviewController.createReview)
  .get(reviewController.getReviews);

router
  .route('/:reviewId')
  .get(validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth('manageUsers'), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth('manageUsers'), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;

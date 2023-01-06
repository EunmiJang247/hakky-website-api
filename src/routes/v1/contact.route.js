const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/contact.validation');
const contactController = require('../../controllers/contact.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(contactValidation.createContact), contactController.createContact)
  .get(contactController.getContacts);

router
  .route('/:contactId')
  .get(auth('manageUsers'), validate(contactValidation.getContact), contactController.getContact)
  .patch(auth('manageUsers'), validate(contactValidation.updateContact), contactController.updateContact)
  .delete(auth('manageUsers'), validate(contactValidation.deleteContact), contactController.deleteContact);

module.exports = router;

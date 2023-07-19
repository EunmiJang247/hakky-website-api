const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(auth('ADMIN'), validate(userValidation.getUsers), userController.getUsers);
router
  .route('/subAdmin/')
  .get(auth('ADMIN'), validate(userValidation.getUsers), userController.getSubAdmins);
router
  .route('/admin/:userId')
  .patch(auth('ADMIN'), validate(userValidation.adminUpdateUser), userController.adminUpdateUser);
router
  .route('/:userId')
  .get(auth('' || 'ADMIN'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('' || 'ADMIN'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('' || 'ADMIN'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;

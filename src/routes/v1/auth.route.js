const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login/naver', validate(authValidation.registerNaver), authController.registerNaver);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-token', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.post('/check-token', auth(), authController.checkToken);

module.exports = router;

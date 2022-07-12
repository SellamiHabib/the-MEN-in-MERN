const express = require('express');

const authController = require('../controllers/auth');
const inputValidators = require('../middlewares/inputValidators');
const User = require("../models/user");

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', inputValidators.loginValidator, authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', inputValidators.signUpValidator, authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', inputValidators.resetValidator, authController.postReset);

router.get('/reset/:token', authController.getNewPasswordReset);

router.post('/new-password',inputValidators.newPasswordResetValidator, authController.postNewPasswordReset);

router.post('/logout', authController.postLogout);

module.exports = router;
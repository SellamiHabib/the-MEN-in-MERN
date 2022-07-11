const express = require('express');

const authController = require('../controllers/auth');
const validators = require('../middlewares/validators');
const User = require("../models/user");

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup',validators.signUpValidator, authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPasswordReset);

router.post('/new-password', authController.postNewPasswordReset);

router.post('/logout', authController.postLogout);

module.exports = router;
const express = require('express');
const authController = require('../controllers/authController');
const inputValidator = require('../middlewares/inputValidation');

const router = express.Router();

router.post('/login', authController.postLogin);
router.put('/signup', inputValidator.signupValidator, authController.putSignUp);


module.exports = router;
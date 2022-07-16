const express = require('express');
const feedController = require('../controllers/feedController');
const inputValidator = require('../middlewares/inputValidation');

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post('/posts', inputValidator.addPostValidator, feedController.postAddPost);

router.get('/posts/:postId', feedController.getOnePost);

module.exports = router;

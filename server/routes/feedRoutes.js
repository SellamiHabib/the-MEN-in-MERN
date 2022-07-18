const express = require('express');
const feedController = require('../controllers/feedController');
const inputValidator = require('../middlewares/inputValidation');
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get('/posts',isAuth, feedController.getPosts);
router.post('/posts',isAuth, inputValidator.addPostValidator, feedController.postAddPost);

router.get('/posts/:postId',isAuth, feedController.getOnePost);
router.put('/posts/:postId',isAuth, inputValidator.addPostValidator, feedController.editPost);
router.delete('/posts/:postId',isAuth, feedController.deletePost);

module.exports = router;

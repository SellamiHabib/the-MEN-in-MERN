const express = require('express');
const feedController = require('../controllers/feedController');
const inputValidator = require('../middlewares/inputValidation');

const router = express.Router();

router.get('/posts', feedController.getPosts);
router.post('/posts', inputValidator.addPostValidator, feedController.postAddPost);

router.get('/posts/:postId', feedController.getOnePost);
router.put('/posts/:postId', inputValidator.addPostValidator, feedController.editPost);
router.delete('/posts/:postId', feedController.deletePost);

module.exports = router;

const express = require('express');
const adminController = require('../controllers/admin');
const inputValidator = require('../middlewares/inputValidators');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, inputValidator.editProductInputValidator, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, inputValidator.editProductInputValidator, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;

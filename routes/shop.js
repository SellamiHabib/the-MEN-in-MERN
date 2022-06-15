const express = require('express');

const shopController = require('../controllers/shopController');
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get('/', shopController.getShopPage);

router.get('/products/:id', shopController.getProductDetailsPage);

router.get('/products', shopController.getProductsPage);

router.get('/cart', shopController.getCartPage);

 router.post('/cart/deleteProduct',shopController.postDeleteCartProduct)

router.post('/addToCart',shopController.postAddToCartPage);

module.exports = router;
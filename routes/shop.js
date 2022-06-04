const express = require('express');

const shopController = require('../controllers/shopController');
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get('/', shopController.getShopPage);
router.get('/products', shopController.getProductsPage);
router.get('/products/:id', shopController.getProductDetailsPage);

router.get('/cart', shopController.getCartPage);


router.post('/addToCart',shopController.postAddToCartPage);
module.exports = router;
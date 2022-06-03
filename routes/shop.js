const express = require('express');

const productsController = require('../controllers/productsController');
const adminController = require("../controllers/adminController");
const router = express.Router();

router.get('/', productsController.getShopPage);
router.get('/products', productsController.getProductsPage);
router.get('/cart', productsController.getCartPage);

router.post('/addToCart',productsController.postAddToCartPage);
module.exports = router;
const express = require('express');

const productsController = require('../controllers/productsController');
const router = express.Router();

router.get('/', productsController.getShopPage);
router.get('/products', productsController.getProductsPage);
router.get('/cart', productsController.getCartPage);

module.exports = router;
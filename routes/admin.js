const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');

// /admin/
router.get('/add-product', productsController.getAddProductPage);
router.post('/add-product', productsController.postAddProductPage);

module.exports = router;
const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

// /admin
router.get('/adminProducts', adminController.getAdminProductsPage)
router.get('/addProduct', adminController.getAddProductPage);
router.post('/addProduct', adminController.postAddProductPage);

router.get('/editProduct',adminController.getEditProductPage);
router.post('/editProduct',adminController.postEditProductPage);

router.post('/deleteProduct',adminController.postDeleteProductPage);



module.exports = router;
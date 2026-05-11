const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);

router.get('/:id', productController.getProduct);

router.get('/:id/variants', productController.getProductVariants);

router.get('/variants/:id', productController.getVariant);

module.exports = router;

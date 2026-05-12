const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.get('/search', variantController.searchVariants);
router.post('/', variantController.createVariant);
router.put('/:id', variantController.updateVariant);
router.delete('/:id', variantController.deleteVariant);

module.exports = router;

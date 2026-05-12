const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warrantyController');

router.get('/search', warrantyController.searchWarranty);
router.get('/history', warrantyController.getWarrantyHistory);

module.exports = router;

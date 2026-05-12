const express = require('express');
const router = express.Router();
const exportReceiptController = require('../controllers/exportReceiptController');

router.get('/', exportReceiptController.getExportReceipts);
router.post('/', exportReceiptController.createExportReceipt);
router.get('/:id', exportReceiptController.getExportReceipt);

module.exports = router;

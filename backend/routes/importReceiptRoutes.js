const express = require('express');
const router = express.Router();
const importReceiptController = require('../controllers/importReceiptController');

router.get('/', importReceiptController.getImportReceipts);
router.post('/', importReceiptController.createImportReceipt);
router.get('/:id', importReceiptController.getImportReceipt);

module.exports = router;

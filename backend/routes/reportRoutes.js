const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/dashboard', reportController.getDashboardStats);
router.get('/revenue', reportController.getRevenueReport);
router.get('/revenue/:date', reportController.getRevenueByDate);
router.get('/inventory', reportController.getInventoryReport);
router.get('/debt', reportController.getDebtReport);
router.get('/debt/:supplierId', reportController.getDebtDetail);

module.exports = router;

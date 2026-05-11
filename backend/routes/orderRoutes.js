const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/stats', orderController.getOrderStats);
router.get('/', orderController.getAllOrders);

router.post('/', orderController.createOrder);

router.get('/:id', orderController.getOrder);

router.put('/:id/items', orderController.updateOrderItem);

router.post('/:id/items', orderController.addOrderItem);

router.delete('/:orderId/items/:variantId', orderController.deleteOrderItem);

router.patch('/:id/checkout', orderController.checkoutOrder);

router.get('/:id/print', orderController.getOrderPrint);

router.patch('/:id/return', orderController.processReturn);

module.exports = router;

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All staff routes require admin privileges
router.use(authenticate, requireAdmin);
router.get('/', staffController.getStaffList);
router.post('/', staffController.createStaff);
router.get('/:id', staffController.getStaff);
router.put('/:id', staffController.updateStaff);
router.put('/:id/role', staffController.assignRole);
router.put('/:id/password', staffController.resetPassword);
router.put('/:id/deactivate', staffController.deactivateStaff);

module.exports = router;

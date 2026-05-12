const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// All staff routes typically require admin privileges, but we handle that in middleware/controller later
router.get('/', staffController.getStaffList);
router.post('/', staffController.createStaff);
router.get('/:id', staffController.getStaff);
router.put('/:id', staffController.updateStaff);
router.put('/:id/role', staffController.assignRole);
router.put('/:id/password', staffController.resetPassword);
router.put('/:id/deactivate', staffController.deactivateStaff);

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/adminController');
const { isAuthenticatedAdmin
    // , authorizeRoles
 } = require('../../middleware/auth');

// Create admin (initial setup)tes
router.post('/', adminController.createAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/logout', adminController.logoutAdmin);
router.get('/me', isAuthenticatedAdmin,adminController.getAdminDetails );
router.put('/me/update', isAuthenticatedAdmin,adminController.updateAdminProfile);

module.exports = router;

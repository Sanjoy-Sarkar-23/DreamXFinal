// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdminMiddleware } = require('../routes/middleware');

// Define routes for the admin
router.get('/admin', isAdminMiddleware, adminController.admin);
router.get('/add_order', isAdminMiddleware, adminController.add_order);
router.get('/add_vehicle', isAdminMiddleware, adminController.add_vehicle);
router.post('/add_vehicle', isAdminMiddleware, adminController.createListing);
router.get('/order', isAdminMiddleware, adminController.order);
router.get('/brands', isAdminMiddleware, adminController.brands);
router.get('/banner', isAdminMiddleware, adminController.banner);
router.get('/edit_order', isAdminMiddleware, adminController.edit_order);
router.get('/edit_vehicle/:id', isAdminMiddleware, adminController.edit_vehicle);
router.post('/edit_vehicle/:id', isAdminMiddleware, adminController.editItem);
router.get('/vehicle', isAdminMiddleware, adminController.vehicle);
router.get('/user', isAdminMiddleware, adminController.user);
router.get('/seller_admin', isAdminMiddleware, adminController.seller_admin);
router.get('/category', isAdminMiddleware, adminController.category);
router.get('/admin_profile', isAdminMiddleware, adminController.admin_profile);
router.get('/body_type', isAdminMiddleware, adminController.body_type);
router.post('/delete/:id', isAdminMiddleware, adminController.deleteItem);

module.exports = router;

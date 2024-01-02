// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define routes for the admin
router.get('/admin', adminController.admin);
router.get('/add_order', adminController.add_order);
router.get('/add_vehicle', adminController.add_vehicle);
router.post('/add_vehicle', adminController.createListing);
router.get('/order', adminController.order);
router.get('/brands', adminController.brands);
router.get('/banner', adminController.banner);
router.get('/edit_order', adminController.edit_order);
router.get('/edit_vehicle/:id', adminController.edit_vehicle);
router.post('/edit_vehicle/:id', adminController.editItem);
router.get('/vehicle', adminController.vehicle);
router.get('/user', adminController.user);
router.get('/seller_admin', adminController.seller_admin);
router.get('/category', adminController.category);
router.get('/admin_profile', adminController.admin_profile);
router.get('/body_type', adminController.body_type);
router.post('/delete/:id', adminController.deleteItem);

module.exports = router;

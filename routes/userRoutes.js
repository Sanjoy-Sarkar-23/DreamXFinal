// userRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { isAdminMiddleware } = require('../routes/middleware');

router.get('/', userController.index);
router.get('/shortlist', isAdminMiddleware, userController.shortlist);
router.get('/shop/:filter?', userController.shop);
router.get('/product/:id', userController.product);
router.get('/order', userController.order);
router.get('/seller', isAdminMiddleware, userController.seller);
router.post('/seller', userController.sellerApply);
router.get('/contact-us', userController.contactUs);
router.get('/change-password', isAdminMiddleware, userController.changePassword);
router.get('/edit-profile', isAdminMiddleware, userController.editProfile);
router.get('/profile', isAdminMiddleware, userController.userProfile);
router.post('/wishList', isAdminMiddleware, userController.wishList);
router.post('/wishList/remove', isAdminMiddleware, userController.wishlistRemove);
router.get('/success', userController.success);



module.exports = router;
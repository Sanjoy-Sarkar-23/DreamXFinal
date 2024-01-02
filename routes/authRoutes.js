
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup routes
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout route
router.get('/logout', authController.logout);

// ... (other routes)

module.exports = router;

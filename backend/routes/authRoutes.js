const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/user', authController.getUser);
router.put('/profile/:userId', authController.updateProfile);
router.post('/logout', authController.logout);

module.exports = router;

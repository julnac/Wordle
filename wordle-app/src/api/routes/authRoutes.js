const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

module.exports = router;
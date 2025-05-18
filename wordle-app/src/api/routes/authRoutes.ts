import express, { Router } from 'express';
import AuthController from '../controllers/authController';

const router: Router = express.Router();
const authController = new AuthController();

// User Registration
router.post('/register', authController.register);

// User Login
router.post('/login', authController.login);

export default router;

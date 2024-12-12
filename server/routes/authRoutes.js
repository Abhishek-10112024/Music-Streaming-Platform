import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

// sign-up route
router.post('/register', register);

// login route
router.post('/login', login);

// logout route
router.post('/logout', userAuthentication, logout);

export default router;

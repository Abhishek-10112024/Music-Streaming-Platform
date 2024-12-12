import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get a list of all registered users (admin only)
router.get('/', userAuthentication, getAllUsers);

// Delete a user (admin only)
router.delete('/:userId', userAuthentication, deleteUser);

export default router;

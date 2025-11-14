import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Rotas protegidas
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/verify', authenticateToken, AuthController.verify);

export default router;
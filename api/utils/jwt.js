import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Gerar token JWT
export function generateToken(userId, email) {
    return jwt.sign(
        {
            userId,
            email,
            type: 'access'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Verificar token JWT
export async function verifyToken(token) {
    try {
        // Verificar se o token está na blacklist
        const [blacklisted] = await pool.execute(
            'SELECT * FROM token_blacklist WHERE token = ?',
            [token]
        );

        if (blacklisted.length > 0) {
            throw new Error('Token revogado');
        }

        // Verificar assinatura e expiração
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Token inválido: ' + error.message);
    }
}

// Adicionar token à blacklist
export async function addToBlacklist(token) {
    try {
        const decoded = jwt.decode(token);
        const expiracao = new Date(decoded.exp * 1000);

        await pool.execute(
            'INSERT INTO token_blacklist (token, expiracao) VALUES (?, ?)',
            [token, expiracao]
        );

        return true;
    } catch (error) {
        console.error('Erro ao adicionar token à blacklist:', error);
        return false;
    }
}
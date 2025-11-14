import pool from '../config/database.js';

export class User {
    // Buscar usuário por email
    static async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
            [email]
        );
        return rows[0];
    }

    // Buscar usuário por ID
    static async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, nome, email, telefone, data_nascimento FROM usuarios WHERE id = ? AND ativo = 1',
            [id]
        );
        return rows[0];
    }

    // Criar usuário
    static async create(userData) {
        const { nome, email, senha, telefone, data_nascimento } = userData;

        const [result] = await pool.execute(
            `INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento) 
       VALUES (?, ?, ?, ?, ?)`,
            [nome, email, senha, telefone, data_nascimento]
        );

        return result.insertId;
    }

    // Atualizar usuário
    static async update(id, userData) {
        const { nome, telefone, data_nascimento } = userData;

        const [result] = await pool.execute(
            `UPDATE usuarios SET nome = ?, telefone = ?, data_nascimento = ? 
       WHERE id = ?`,
            [nome, telefone, data_nascimento, id]
        );

        return result.affectedRows > 0;
    }
}
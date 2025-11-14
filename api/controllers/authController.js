import { User } from '../models/User.js';
import { addToBlacklist, generateToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export class AuthController {
    // Login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            // Validar dados
            if (!email || !senha) {
                return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
            }

            // Buscar usuário
            const usuario = await User.findByEmail(email);
            if (!usuario) {
                return res.status(401).json({ mensagem: 'Credenciais inválidas' });
            }

            // Verificar senha
            const senhaValida = await verifyPassword(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ mensagem: 'Credenciais inválidas' });
            }

            // Gerar token
            const token = generateToken(usuario.id, usuario.email);

            // Retornar dados (sem a senha)
            const { senha: _, ...usuarioSemSenha } = usuario;

            res.json({
                token,
                usuario: usuarioSemSenha,
                mensagem: 'Login realizado com sucesso'
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    // Logout
    static async logout(req, res) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token) {
                await addToBlacklist(token);
            }

            res.json({ mensagem: 'Logout realizado com sucesso' });
        } catch (error) {
            console.error('Erro no logout:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    // Registrar usuário
    static async register(req, res) {
        try {
            const { nome, email, senha, telefone, data_nascimento } = req.body;

            // Validar dados
            if (!nome || !email || !senha) {
                return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
            }

            // Verificar se usuário já existe
            const usuarioExistente = await User.findByEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({ mensagem: 'Email já cadastrado' });
            }

            // Hash da senha
            const senhaHash = await hashPassword(senha);

            // Criar usuário
            const userId = await User.create({
                nome,
                email,
                senha: senhaHash,
                telefone,
                data_nascimento
            });

            // Gerar token
            const token = generateToken(userId, email);

            res.status(201).json({
                token,
                usuario: { id: userId, nome, email, telefone, data_nascimento },
                mensagem: 'Usuário criado com sucesso'
            });

        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

    // Verificar token (usado pelo app para validar sessão)
    static async verify(req, res) {
        try {
            // Se chegou aqui, o middleware de autenticação já validou o token
            const usuario = await User.findById(req.user.userId);

            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }

            res.json({ usuario, valido: true });
        } catch (error) {
            console.error('Erro na verificação:', error);
            res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }
}
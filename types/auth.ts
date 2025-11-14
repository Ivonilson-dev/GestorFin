// 📚 CONCEITO TS: Interfaces - definem a forma de um objeto
export interface User {
    id: number;
    nome: string;
    email: string;
    telefone?: string; // 📚 CONCEITO TS: "?" indica propriedade opcional
    data_nascimento?: string;
}

export interface LoginData {
    email: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
    usuario: User;
    mensagem?: string;
}
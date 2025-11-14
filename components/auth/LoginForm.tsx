import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    View
} from 'react-native';

// 📚 CONCEITO TS: Importando nossas interfaces
import { AuthResponse, LoginData } from '../../types/auth';
import Container from '../layout/Container';
import Button from '../ui/Button';
import Input from '../ui/Input';

// 📚 CONCEITO TS: Props - definimos as propriedades que o componente recebe
interface LoginFormProps {
    onSuccess?: () => void;
    onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginData>({
        // 📚 CONCEITO TS: Tipo genérico - useState<LoginData> garante que formData sempre será do tipo LoginData
        email: '',
        senha: ''
    });
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const router = useRouter();

    // 📚 CONCEITO TS: Tipo de parâmetro - email: string
    const handleInputChange = (field: keyof LoginData, value: string) => {
        // 📚 CONCEITO TS: keyof - garante que field seja uma chave válida de LoginData
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        if (!isValidEmail(formData.email)) {
            Alert.alert('Erro', 'Por favor, insira um email válido');
            return;
        }

        setLoading(true);

        try {
            // TODO: Substituir pela URL real da API
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.toLowerCase().trim(),
                    senha: formData.senha
                }),
            });

            // 📚 CONCEITO TS: Type Assertion - dizemos que data é do tipo AuthResponse
            const data = await response.json() as AuthResponse;

            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.token);
                await AsyncStorage.setItem('userData', JSON.stringify(data.usuario));

                Alert.alert('Sucesso', 'Login realizado com sucesso!');

                if (onSuccess) {
                    onSuccess();
                } else {
                    router.replace('/(tabs)');
                }
            } else {
                Alert.alert('Erro', data.mensagem || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            Alert.alert('Erro', 'Não foi possível conectar ao servidor');
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string): boolean => {
        // 📚 CONCEITO TS: Tipo de retorno - : boolean indica que retorna true ou false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <Container>
            <Text style={styles.title}>GestorFin</Text>
            {/** <Text style={styles.subtitle}>Faça login na sua conta</Text> */}

            <View style={styles.form}>
                <Input
                    label="Email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />

                <Input
                    label="Senha"
                    placeholder="Sua senha"
                    value={formData.senha}
                    onChangeText={(value) => handleInputChange('senha', value)}
                    secureTextEntry={!mostrarSenha}
                    editable={!loading}
                    showPasswordToggle
                    onTogglePassword={() => setMostrarSenha(!mostrarSenha)}
                    isPasswordVisible={mostrarSenha}
                />

                <Button
                    title="Entrar"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                />

                {/*
                    <Button
                    title="Criar uma conta"
                    onPress={onSwitchToRegister}
                    variant="outline"
                    disabled={loading}
                />
                */}
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    form: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2D3748',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#718096',
        marginBottom: 40,
    },
});
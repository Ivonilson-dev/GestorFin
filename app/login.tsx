import { useRouter } from 'expo-router';
import React from 'react';
import LoginForm from '../components/auth/LoginForm';

export default function LoginScreen() {
    const router = useRouter();

    const handleSwitchToRegister = () => {
        router.push('/cadastro');
    };

    return (
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
    );
}
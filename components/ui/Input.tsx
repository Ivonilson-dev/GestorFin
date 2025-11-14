import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View
} from 'react-native';

// 📚 CONCEITO TS: Extendendo props nativas + nossas custom props
interface InputProps extends TextInputProps {
    label: string;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    isPasswordVisible?: boolean;
}

export default function Input({
    label,
    showPasswordToggle = false,
    onTogglePassword,
    isPasswordVisible = false,
    ...props
}: InputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, showPasswordToggle && styles.inputWithButton]}
                    placeholderTextColor="#999"
                    {...props} // 📚 CONCEITO TS: Spread operator para passar todas as props do TextInput
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={onTogglePassword}
                    >
                        <Text style={styles.eyeText}>
                            {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        backgroundColor: '#F7FAFC',
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    inputWithButton: {
        paddingRight: 50,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    eyeText: {
        fontSize: 16,
    },
});
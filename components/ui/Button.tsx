import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from 'react-native';

// 📚 CONCEITO TS: Nossa interface customizada
interface ButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'outline';
}

export default function Button({
    title,
    loading = false,
    variant = 'primary',
    style,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' ? styles.primary : styles.outline,
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? '#FFF' : '#4299E1'}
                />
            ) : (
                <Text style={[
                    styles.text,
                    variant === 'primary' ? styles.textPrimary : styles.textOutline
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    primary: {
        backgroundColor: '#4299E1',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4299E1',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textPrimary: {
        color: '#FFF',
    },
    textOutline: {
        color: '#4299E1',
    },
});
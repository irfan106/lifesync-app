import React, { useState } from 'react';
import { View, TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@context/ThemeContext';
import { Typography } from '../Typography';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  label, 
  error, 
  style,
  ...props 
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.sm,
    },
    label: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      fontSize: theme.fontSize.sm,
    },
    inputWrapper: {
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: error 
        ? theme.colors.error 
        : isFocused 
          ? 'rgba(139, 92, 246, 0.6)' 
          : 'rgba(255, 255, 255, 0.15)',
    },
    blur: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    input: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      color: theme.colors.text,
      fontSize: theme.fontSize.md,
    },
    error: {
      color: theme.colors.error,
      fontSize: theme.fontSize.xs,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Typography style={styles.label}>{label}</Typography>}
      <View style={styles.inputWrapper}>
        <BlurView intensity={40} tint="dark" style={styles.blur}>
          <RNTextInput
            style={[styles.input, style]}
            placeholderTextColor={theme.colors.textMuted}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </BlurView>
      </View>
      {error && <Typography style={styles.error}>{error}</Typography>}
    </View>
  );
};

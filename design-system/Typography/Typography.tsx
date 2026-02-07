import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  style, 
  children, 
  ...props 
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: theme.colors.text,
    },
    h1: {
      fontSize: theme.fontSize.xxl,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
    },
    h2: {
      fontSize: theme.fontSize.xl,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    h3: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    body: {
      fontSize: theme.fontSize.md,
    },
    caption: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <Text 
      style={[styles.text, styles[variant], style]} 
      {...props}
    >
      {children}
    </Text>
  );
};

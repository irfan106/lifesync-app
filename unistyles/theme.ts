export const theme = {
  colors: {
    primary: '#6C63FF', // Dreamy Purple
    secondary: '#03DAC6', // Teal
    background: '#121212', // Dark Background
    surface: '#1E1E1E', // Card Background
    text: '#E1E1E1', // Primary Text
    textSecondary: '#A0A0A0', // Secondary Text
    error: '#CF6679',
    success: '#03DAC6',
    border: '#333333',
    card: '#2C2C2C',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
} as const;

export type AppTheme = typeof theme;

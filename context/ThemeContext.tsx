import React, { createContext, useContext } from 'react';

export const theme = {
  colors: {
    // Dark blue-ish background - NOT pure black
    background: '#0F0F1A',
    backgroundLight: '#1A1A2E',
    backgroundCard: '#1E1E30',
    
    // Glass surfaces - slightly more visible
    glass: 'rgba(255, 255, 255, 0.06)',
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassActive: 'rgba(255, 255, 255, 0.15)',
    
    // Primary - Blue
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#1D4ED8',
    
    // Accent colors
    secondary: '#8B5CF6',
    accent: '#10B981',
    pink: '#EC4899',
    orange: '#F97316',
    
    // Status
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Text
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    
    // Borders
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    
    // Tab bar
    tabBar: 'rgba(15, 15, 26, 0.8)',
    
    // Legacy aliases
    surface: 'rgba(255, 255, 255, 0.06)',
    danger: '#EF4444',
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
};

export type AppTheme = typeof theme;

const ThemeContext = createContext<AppTheme>(theme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

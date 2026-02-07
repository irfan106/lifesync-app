import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@context/ThemeContext';
import { Typography } from '@design-system/Typography';

export const NoFapCounter = () => {
  const theme = useTheme();
  const [streakDays, setStreakDays] = useState(12);

  const handleRelapse = () => {
      setStreakDays(0);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    count: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    label: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    button: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: theme.fontSize.sm,
    }
  });

  return (
    <View style={styles.card}>
      <Typography variant="h3" style={styles.label}>Discipline Streak</Typography>
      <Typography style={styles.count}>{streakDays} Days</Typography>
      <Typography variant="caption" style={{ marginBottom: 16 }}>Keep going! You are stronger than your urges.</Typography>
      
      <TouchableOpacity style={styles.button} onPress={handleRelapse}>
        <Typography style={styles.buttonText}>I Relapsed</Typography>
      </TouchableOpacity>
    </View>
  );
};

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { Ionicons } from "@expo/vector-icons";

export const WalletHeader = () => {
  const theme = useTheme();
  const router = useRouter();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    date: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: "800",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    actions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.glass,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography style={styles.date}>{formattedDate}</Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="wallet-outline" size={24} color={theme.colors.text} />
          <Typography style={styles.title}>Spending Tracker</Typography>
        </View>
        <Typography style={styles.subtitle}>Track every penny</Typography>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/wallet/history")}
        >
          <Ionicons name="time-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/wallet/analytics")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

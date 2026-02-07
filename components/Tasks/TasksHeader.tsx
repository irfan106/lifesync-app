import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export const TasksHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const today = new Date();

  // Format: "Mon, 26 Jan"
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      color: theme.colors.text,
      fontWeight: "800",
      fontSize: 32,
    },
    subtitle: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontSize: 14,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    historyBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.08)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <Typography style={styles.subtitle}>{dateStr}</Typography>
        <Typography style={styles.title}>Today's Focus</Typography>
      </View>
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => router.push("/tasks/history")}
      >
        <Ionicons name="time-outline" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
};

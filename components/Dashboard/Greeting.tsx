import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import { Typography } from "@design-system/Typography";
import { Ionicons } from "@expo/vector-icons";
import { GlassCard } from "@design-system/GlassCard";
import { QUOTES } from "../../constants/quotes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Greeting = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [icon, setIcon] =
    useState<keyof typeof Ionicons.glyphMap>("sunny-outline");
  const [quote, setQuote] = useState(QUOTES[0]);

  const STORAGE_KEY = "@daily_quote_v1";

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
        setIcon("sunny-outline");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
        setIcon("partly-sunny-outline");
      } else {
        setGreeting("Good Evening");
        setIcon("moon-outline");
      }
    };

    const loadQuote = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        const now = Date.now();

        if (storedData) {
          const { quote: storedQuote, expiresAt } = JSON.parse(storedData);

          if (now < expiresAt) {
            // Valid quote found
            setQuote(storedQuote);
            return;
          }
        }

        // Expired or no data -> Generate New
        const newQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        const expiresAt = now + 24 * 60 * 60 * 1000; // 24 Hours from now

        setQuote(newQuote);
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ quote: newQuote, expiresAt }),
        );
      } catch (error) {
        console.log("Error loading quote:", error);
      }
    };

    updateGreeting();
    loadQuote();
  }, []);

  const displayName = user?.displayName || "Friend";

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    appName: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.xs,
      fontWeight: "700",
      letterSpacing: 2,
      marginBottom: 8,
      textTransform: "uppercase",
    },
    greetingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    greeting: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.md,
      fontWeight: "500",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    name: {
      color: theme.colors.text,
      fontSize: 32,
      fontWeight: "800",
      letterSpacing: -0.5,
      lineHeight: 40,
    },
    wave: {
      fontSize: 30,
      marginLeft: 10,
    },
    quoteContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    quoteText: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: theme.fontSize.sm,
      lineHeight: 22,
      fontStyle: "italic",
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.greetingRow}>
        <Ionicons name={icon} size={20} color={theme.colors.text} />
        <Typography style={styles.greeting}>{greeting},</Typography>
      </View>

      <View style={styles.nameContainer}>
        <Typography style={styles.name}>{displayName}</Typography>
        <Ionicons
          name="sparkles"
          size={24}
          color={theme.colors.text}
          style={{ marginLeft: 8 }}
        />
      </View>

      <GlassCard variant="featured">
        <View style={styles.quoteContent}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color={theme.colors.text}
          />
          <Typography style={styles.quoteText}>"{quote}"</Typography>
        </View>
      </GlassCard>
    </View>
  );
};

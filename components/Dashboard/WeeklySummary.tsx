import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useExpenses } from "@controllers/expense.controller";
import { Ionicons } from "@expo/vector-icons";

export const WeeklySummary = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: expenses = [] } = useExpenses();

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // Last week for comparison
  const lastWeekStart = new Date(startOfWeek);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(startOfWeek);

  const weeklyExpenses = expenses.filter(
    (expense) => new Date(expense.date) >= startOfWeek,
  );
  const lastWeekExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    return date >= lastWeekStart && date < lastWeekEnd;
  });

  const totalThisWeek = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalLastWeek = lastWeekExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate trend
  const trend =
    totalLastWeek > 0
      ? (((totalThisWeek - totalLastWeek) / totalLastWeek) * 100).toFixed(0)
      : 0;
  const isTrendUp = Number(trend) > 0;

  const categoryTotals: { [key: string]: number } = {};
  weeklyExpenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const dailySpending: number[] = [0, 0, 0, 0, 0, 0, 0];
  weeklyExpenses.forEach((expense) => {
    const day = new Date(expense.date).getDay();
    dailySpending[day] += expense.amount;
  });
  const maxSpending = Math.max(...dailySpending, 1);
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const styles = StyleSheet.create({
    container: {
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    content: {
      padding: theme.spacing.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    viewAll: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
      fontWeight: "500",
      letterSpacing: 0.5,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    titleIcon: {
      fontSize: 18,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: "700",
      color: theme.colors.text,
    },
    trendBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    trendUp: {
      backgroundColor: "rgba(239, 68, 68, 0.15)",
    },
    trendDown: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
    },
    trendText: {
      fontSize: 12,
      fontWeight: "600",
    },
    trendTextUp: {
      color: "#EF4444",
    },
    trendTextDown: {
      color: "#10B981",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    statItem: {},
    statValue: {
      fontSize: 28,
      fontWeight: "800",
      color: "#3B82F6", // Primary Blue (Standardized)
      textShadowColor: "rgba(59, 130, 246, 0.4)", // Blue Glow
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 8,
    },
    statLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    topCategoryContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      minWidth: 100, // Ensure space to prevent truncation
    },
    topCategoryValue: {
      fontSize: theme.fontSize.md,
      fontWeight: "600",
      color: theme.colors.text,
      textTransform: "capitalize",
    },
    chartContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      height: 80,
      paddingTop: 10,
    },
    barWrapper: {
      alignItems: "center",
      flex: 1,
    },
    bar: {
      width: 22,
      borderRadius: 11,
      marginBottom: theme.spacing.xs,
      overflow: "hidden",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.05)",
    },
    barEmpty: {
      height: 4,
    },
    dayLabel: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    todayLabel: {
      color: "#3B82F6", // Primary Blue
      fontWeight: "700",
    },
    barAmount: {
      fontSize: 9,
      color: theme.colors.textMuted,
      marginBottom: 2,
    },
    viewAllContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });

  // ... (existing code)

  return (
    <GlassCard variant="featured">
      {/* ... header ... */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="bar-chart-outline"
            size={20}
            color={theme.colors.text}
          />
          <Typography style={styles.title}>Weekly Spending</Typography>
        </View>
        <TouchableOpacity onPress={() => router.push("/wallet")}>
          <View style={styles.viewAllContainer}>
            <Typography
              style={[styles.viewAll, { textDecorationLine: "underline" }]}
            >
              View All
            </Typography>
            <Ionicons
              name="arrow-forward-outline"
              size={16}
              color={theme.colors.textMuted}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Typography style={styles.statValue}>
              ₹{totalThisWeek.toFixed(0)}
            </Typography>
            {totalLastWeek > 0 && (
              <View
                style={[
                  styles.trendBadge,
                  isTrendUp ? styles.trendUp : styles.trendDown,
                ]}
              >
                <Typography
                  style={[
                    styles.trendText,
                    isTrendUp ? styles.trendTextUp : styles.trendTextDown,
                  ]}
                >
                  {isTrendUp ? "↑" : "↓"} {Math.abs(Number(trend))}%
                </Typography>
              </View>
            )}
          </View>
          <Typography style={styles.statLabel}>Total Spent</Typography>
        </View>
        {topCategory && (
          <View style={styles.topCategoryContainer}>
            <Typography style={styles.topCategoryValue}>
              {topCategory[0]}
            </Typography>
            <Typography style={styles.statLabel}>Top Category</Typography>
          </View>
        )}
      </View>

      <View style={styles.chartContainer}>
        {dailySpending.map((amount, index) => {
          const height = Math.max((amount / maxSpending) * 50, 6);
          const isToday = index === today.getDay();
          return (
            <View key={index} style={styles.barWrapper}>
              {amount > 0 && (
                <Typography style={styles.barAmount}>
                  ₹{amount.toFixed(0)}
                </Typography>
              )}
              <View
                style={[
                  styles.bar,
                  { height },
                  amount === 0 && styles.barEmpty,
                  {
                    borderColor:
                      amount > 0
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(255,255,255,0.05)",
                  },
                ]}
              >
                {amount > 0 && (
                  <LinearGradient
                    colors={
                      isToday
                        ? ["#3B82F6", "#2563EB"] // Primary Blue (Today)
                        : ["rgba(59, 130, 246, 0.5)", "rgba(59, 130, 246, 0.1)"] // Glassy Blue (Others)
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{ flex: 1, borderRadius: 11 }}
                  />
                )}
              </View>
              <Typography
                style={[styles.dayLabel, isToday && styles.todayLabel]}
              >
                {days[index]}
              </Typography>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

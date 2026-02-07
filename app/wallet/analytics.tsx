import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { useExpenses } from "@controllers/expense.controller";
import {
  IExpense,
  EXPENSE_CATEGORIES,
  ExpenseCategory,
} from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

const { width } = Dimensions.get("window");

// Simplified monochromatic color palette
const CATEGORY_COLORS: Record<string, string> = {
  food: "#8B5CF6",
  transport: "#A78BFA",
  shopping: "#C4B5FD",
  bills: "#7C3AED",
  entertainment: "#6D28D9",
  health: "#5B21B6",
  other: "#4C1D95",
};

type TimeRange = "Today" | "This Week" | "This Month" | "Last 30 Days";

// Insight type for structured insights
interface InsightItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  text: string;
}

export default function AnalyticsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: expenses = [], isLoading } = useExpenses();
  const [timeRange, setTimeRange] = useState<TimeRange>("This Week");

  // Get days count based on time range
  const getDaysCount = (range: TimeRange) => {
    switch (range) {
      case "Today":
        return 1;
      case "This Week":
        return 7;
      case "This Month":
        return 30;
      case "Last 30 Days":
        return 30;
      default:
        return 7;
    }
  };

  const daysCount = getDaysCount(timeRange);

  // Calculate daily spending data
  const { chartData, categoryBreakdown, insights, comparisonData } =
    useMemo(() => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      // Initialize daily totals
      const dailyTotals: { date: Date; total: number }[] = [];
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);
        dailyTotals.push({ date: d, total: 0 });
      }

      // Filter expenses within range
      const rangeStart = new Date();
      rangeStart.setDate(today.getDate() - daysCount + 1);
      rangeStart.setHours(0, 0, 0, 0);

      const rangeExpenses = expenses.filter((e) => {
        const expDate = new Date(e.date);
        return expDate >= rangeStart && expDate <= today;
      });

      // Calculate previous period for comparison
      const prevRangeEnd = new Date(rangeStart);
      prevRangeEnd.setDate(prevRangeEnd.getDate() - 1);
      prevRangeEnd.setHours(23, 59, 59, 999);

      const prevRangeStart = new Date(prevRangeEnd);
      prevRangeStart.setDate(prevRangeStart.getDate() - daysCount + 1);
      prevRangeStart.setHours(0, 0, 0, 0);

      const prevExpenses = expenses.filter((e) => {
        const expDate = new Date(e.date);
        return expDate >= prevRangeStart && expDate <= prevRangeEnd;
      });

      const prevTotal = prevExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Calculate daily totals
      rangeExpenses.forEach((e) => {
        const expDate = new Date(e.date);
        expDate.setHours(0, 0, 0, 0);
        const dayEntry = dailyTotals.find(
          (d) => d.date.getTime() === expDate.getTime(),
        );
        if (dayEntry) dayEntry.total += e.amount;
      });

      // Calculate category breakdown
      const categoryTotals: Record<ExpenseCategory, number> = {
        food: 0,
        transport: 0,
        shopping: 0,
        bills: 0,
        entertainment: 0,
        health: 0,
        other: 0,
      };
      rangeExpenses.forEach((e) => {
        categoryTotals[e.category] += e.amount;
      });

      const totalSpent = rangeExpenses.reduce((sum, e) => sum + e.amount, 0);
      const categoryBreakdown = Object.entries(categoryTotals)
        .filter(([_, amount]) => amount > 0)
        .map(([cat, amount]) => {
          const catInfo = EXPENSE_CATEGORIES.find((c) => c.value === cat);
          return {
            category: cat as ExpenseCategory,
            amount,
            percentage:
              totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
            icon: catInfo?.icon || "cube-outline",
            label: catInfo?.label || cat,
          };
        })
        .sort((a, b) => b.amount - a.amount);

      // Generate structured insights
      const insights: InsightItem[] = [];

      // 1. Total spent
      if (totalSpent > 0) {
        const avgDaily = totalSpent / daysCount;
        insights.push({
          icon: "wallet-outline",
          iconColor: theme.colors.primary,
          text: `Total spent: ₹${totalSpent.toFixed(0)} (avg ₹${avgDaily.toFixed(0)}/day)`,
        });
      }

      // 2. Top category
      if (categoryBreakdown.length > 0) {
        const top = categoryBreakdown[0];
        insights.push({
          icon: "trophy-outline",
          iconColor: "#F59E0B",
          text: `Top category: ${top.label} (${top.percentage}%)`,
        });
      }

      // 3. Highest spending day
      const maxDay = dailyTotals.reduce(
        (max, d) => (d.total > max.total ? d : max),
        dailyTotals[0],
      );
      if (maxDay && maxDay.total > 0) {
        const dayName = maxDay.date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
        insights.push({
          icon: "trending-up-outline",
          iconColor: "#EF4444",
          text: `Highest day: ${dayName} (₹${maxDay.total.toFixed(0)})`,
        });
      }

      // 4. Weekend vs Weekday
      const weekendExpenses = rangeExpenses.filter((e) => {
        const day = new Date(e.date).getDay();
        return day === 0 || day === 6;
      });
      const weekdayExpenses = rangeExpenses.filter((e) => {
        const day = new Date(e.date).getDay();
        return day !== 0 && day !== 6;
      });
      const weekendTotal = weekendExpenses.reduce((s, e) => s + e.amount, 0);
      const weekdayTotal = weekdayExpenses.reduce((s, e) => s + e.amount, 0);

      if (weekendTotal > 0 && weekdayTotal > 0) {
        const weekendDays = daysCount === 7 ? 2 : Math.floor(daysCount / 7) * 2;
        const weekdayDays = daysCount - weekendDays;
        const weekendAvg = weekendTotal / Math.max(weekendDays, 1);
        const weekdayAvg = weekdayTotal / Math.max(weekdayDays, 1);

        if (weekendAvg > weekdayAvg * 1.2) {
          const pct = Math.round(
            ((weekendAvg - weekdayAvg) / weekdayAvg) * 100,
          );
          insights.push({
            icon: "calendar-outline",
            iconColor: "#8B5CF6",
            text: `You spend ${pct}% more on weekends`,
          });
        }
      }

      // 5. No-spend days
      const noSpendDays = dailyTotals.filter((d) => d.total === 0).length;
      if (noSpendDays > 0 && daysCount > 1) {
        insights.push({
          icon: "sparkles-outline",
          iconColor: "#10B981",
          text: `${noSpendDays} no-spend day${noSpendDays > 1 ? "s" : ""} this period!`,
        });
      }

      // Comparison data
      const percentChange =
        prevTotal > 0
          ? Math.round(((totalSpent - prevTotal) / prevTotal) * 100)
          : 0;

      return {
        chartData: { totalSpent },
        categoryBreakdown,
        insights,
        comparisonData: {
          current: totalSpent,
          previous: prevTotal,
          percentChange,
          isUp: totalSpent > prevTotal,
        },
      };
    }, [expenses, daysCount, theme.colors.primary]);

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingBottom: 8,
      gap: 16,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    toggleContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    toggleActive: {
      backgroundColor: "rgba(139, 92, 246, 0.3)",
    },
    toggleText: {
      color: theme.colors.textMuted,
      fontWeight: "600",
      fontSize: 12,
    },
    toggleTextActive: {
      color: "#fff",
    },
    card: {
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      padding: 20,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
    },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.05)",
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryLabel: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "600",
    },
    categoryAmount: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    categoryPercent: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.pink,
    },
    progressBarBg: {
      height: 4,
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 2,
      marginTop: 8,
    },
    progressBarFill: {
      height: 4,
      backgroundColor: "#8B5CF6",
      borderRadius: 2,
    },
    insightItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.05)",
      gap: 12,
    },
    insightIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    insightText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    comparisonCard: {
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    comparisonLabel: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    comparisonAmount: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text,
    },
    comparisonBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 4,
    },
    comparisonBadgeText: {
      fontSize: 14,
      fontWeight: "700",
    },
    emptyState: {
      textAlign: "center",
      color: theme.colors.textMuted,
      paddingVertical: 30,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <GlassBackground>
          <Container safeArea transparent>
            <View style={styles.loadingContainer}>
              <Ionicons
                name="analytics-outline"
                size={48}
                color={theme.colors.textMuted}
              />
              <Typography
                style={{ color: theme.colors.textMuted, marginTop: 16 }}
              >
                Loading analytics...
              </Typography>
            </View>
          </Container>
        </GlassBackground>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GlassBackground>
        <Container safeArea transparent style={{ padding: 0 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name="analytics-outline"
                size={24}
                color={theme.colors.text}
              />
              <Typography variant="h2" style={{ fontWeight: "800" }}>
                Analytics
              </Typography>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Time Range Toggle */}
              <View style={styles.toggleContainer}>
                {(
                  [
                    "Today",
                    "This Week",
                    "This Month",
                    "Last 30 Days",
                  ] as TimeRange[]
                ).map((range) => (
                  <TouchableOpacity
                    key={range}
                    style={[
                      styles.toggleButton,
                      timeRange === range && styles.toggleActive,
                    ]}
                    onPress={() => setTimeRange(range)}
                  >
                    <Typography
                      style={[
                        styles.toggleText,
                        timeRange === range && styles.toggleTextActive,
                      ]}
                    >
                      {range}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Comparison Card */}
              <View style={styles.comparisonCard}>
                <View>
                  <Typography style={styles.comparisonLabel}>
                    {timeRange} Total
                  </Typography>
                  <Typography style={styles.comparisonAmount}>
                    ₹{chartData.totalSpent.toFixed(0)}
                  </Typography>
                </View>
                {comparisonData.previous > 0 && (
                  <View
                    style={[
                      styles.comparisonBadge,
                      {
                        backgroundColor: comparisonData.isUp
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(16, 185, 129, 0.2)",
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        comparisonData.isUp
                          ? "trending-up-outline"
                          : "trending-down-outline"
                      }
                      size={16}
                      color={comparisonData.isUp ? "#EF4444" : "#10B981"}
                    />
                    <Typography
                      style={[
                        styles.comparisonBadgeText,
                        {
                          color: comparisonData.isUp ? "#EF4444" : "#10B981",
                        },
                      ]}
                    >
                      {Math.abs(comparisonData.percentChange)}%
                    </Typography>
                  </View>
                )}
              </View>

              {/* Spending Pie Chart */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="pie-chart-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Typography style={styles.cardTitle}>
                    Spending Distribution
                  </Typography>
                </View>
                {categoryBreakdown.length > 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <PieChart
                      data={categoryBreakdown.map((cat) => ({
                        name: cat.label,
                        population: cat.amount,
                        color: CATEGORY_COLORS[cat.category] || "#6B7280",
                        legendFontColor: theme.colors.textSecondary,
                        legendFontSize: 11,
                      }))}
                      width={width - 72}
                      height={180}
                      chartConfig={{
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 40 }}>
                    <Ionicons
                      name="pie-chart-outline"
                      size={48}
                      color={theme.colors.textMuted}
                    />
                    <Typography style={styles.emptyState}>
                      No spending data yet
                    </Typography>
                  </View>
                )}
              </View>

              {/* Category Breakdown */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="bar-chart-outline"
                    size={20}
                    color={theme.colors.secondary}
                  />
                  <Typography style={styles.cardTitle}>
                    Category Breakdown
                  </Typography>
                </View>
                {categoryBreakdown.length > 0 ? (
                  categoryBreakdown.map((cat, index) => (
                    <View key={cat.category}>
                      <View
                        style={[
                          styles.categoryRow,
                          index === categoryBreakdown.length - 1 && {
                            borderBottomWidth: 0,
                          },
                        ]}
                      >
                        <View style={styles.categoryIcon}>
                          <Ionicons
                            name={cat.icon as any}
                            size={20}
                            color={CATEGORY_COLORS[cat.category] || "#8B5CF6"}
                          />
                        </View>
                        <View style={styles.categoryInfo}>
                          <Typography style={styles.categoryLabel}>
                            {cat.label}
                          </Typography>
                          <Typography style={styles.categoryAmount}>
                            ₹{cat.amount.toFixed(2)}
                          </Typography>
                        </View>
                        <Typography style={styles.categoryPercent}>
                          {cat.percentage}%
                        </Typography>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${cat.percentage}%`,
                              backgroundColor:
                                CATEGORY_COLORS[cat.category] || "#8B5CF6",
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 30 }}>
                    <Ionicons
                      name="list-outline"
                      size={48}
                      color={theme.colors.textMuted}
                    />
                    <Typography style={styles.emptyState}>
                      No data available
                    </Typography>
                  </View>
                )}
              </View>

              {/* Smart Insights */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
                  <Typography style={styles.cardTitle}>
                    Smart Insights
                  </Typography>
                </View>
                {insights.length > 0 ? (
                  insights.map((insight, i) => (
                    <View
                      key={i}
                      style={[
                        styles.insightItem,
                        i === insights.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <View style={styles.insightIcon}>
                        <Ionicons
                          name={insight.icon}
                          size={18}
                          color={insight.iconColor}
                        />
                      </View>
                      <Typography style={styles.insightText}>
                        {insight.text}
                      </Typography>
                    </View>
                  ))
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 30 }}>
                    <Ionicons
                      name="bulb-outline"
                      size={48}
                      color={theme.colors.textMuted}
                    />
                    <Typography style={styles.emptyState}>
                      Add expenses to see insights
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </Container>
      </GlassBackground>
    </>
  );
}

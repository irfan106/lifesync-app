import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useExpenses } from "@controllers/expense.controller";
import {
  EXPENSE_CATEGORIES,
  ExpenseCategory,
} from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";

export const SpendingSummary = () => {
  const theme = useTheme();
  const { data: expenses } = useExpenses();

  const { todayTotal, yesterdayTotal, categoryBreakdown } = useMemo(() => {
    if (!expenses)
      return { todayTotal: 0, yesterdayTotal: 0, categoryBreakdown: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Filter today's and yesterday's expenses
    const todayExpenses = expenses.filter((e) => {
      const expDate = new Date(e.date);
      expDate.setHours(0, 0, 0, 0);
      return expDate.getTime() === today.getTime();
    });

    const yesterdayExpenses = expenses.filter((e) => {
      const expDate = new Date(e.date);
      expDate.setHours(0, 0, 0, 0);
      return expDate.getTime() === yesterday.getTime();
    });

    const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const yesterdayTotal = yesterdayExpenses.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    // Category breakdown for today
    const categoryTotals: Record<ExpenseCategory, number> = {
      food: 0,
      transport: 0,
      shopping: 0,
      bills: 0,
      entertainment: 0,
      health: 0,
      other: 0,
    };

    todayExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    // Convert to array with percentages, filter out zeros
    const categoryBreakdown = Object.entries(categoryTotals)
      .filter(([_, amount]) => amount > 0)
      .map(([cat, amount]) => {
        const catInfo = EXPENSE_CATEGORIES.find((c) => c.value === cat);
        return {
          category: cat as ExpenseCategory,
          amount,
          percentage:
            todayTotal > 0 ? Math.round((amount / todayTotal) * 100) : 0,
          icon: catInfo?.icon || "cube-outline",
          label: catInfo?.label || cat,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { todayTotal, yesterdayTotal, categoryBreakdown };
  }, [expenses]);

  // Calculate comparison with yesterday
  const getComparisonText = () => {
    if (yesterdayTotal === 0 && todayTotal === 0) return null;
    if (yesterdayTotal === 0)
      return { text: "First spending today!", color: theme.colors.info };

    const diff = todayTotal - yesterdayTotal;
    const percentChange = Math.abs(Math.round((diff / yesterdayTotal) * 100));

    if (diff > 0) {
      return {
        text: `↑ ${percentChange}% more than yesterday`,
        color: theme.colors.warning,
      };
    } else if (diff < 0) {
      return {
        text: `↓ ${percentChange}% less than yesterday`,
        color: theme.colors.success,
      };
    }
    return { text: "Same as yesterday", color: theme.colors.textMuted };
  };

  const comparison = getComparisonText();

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: "700",
      color: theme.colors.text,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    label: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
    },
    totalAmount: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.colors.text,
    },
    comparison: {
      fontSize: theme.fontSize.xs,
      marginTop: 4,
    },
    divider: {
      height: 1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      marginVertical: theme.spacing.md,
    },
    breakdownTitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    breakdownContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    categoryPill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    categoryText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.text,
    },
    categoryPercent: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textMuted,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.md,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.textMuted,
      marginTop: 8,
    },
  });

  return (
    <GlassCard variant="featured">
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={20} color={theme.colors.text} />
        <Typography style={styles.headerTitle}>Spending Summary</Typography>
      </View>

      <View>
        <Typography style={styles.label}>Today's Spending</Typography>
        <Typography style={styles.totalAmount}>
          ₹{todayTotal.toFixed(2)}
        </Typography>
        {comparison && (
          <Typography style={[styles.comparison, { color: comparison.color }]}>
            {comparison.text}
          </Typography>
        )}
      </View>

      {categoryBreakdown.length > 0 && (
        <>
          <View style={styles.divider} />
          <Typography style={styles.breakdownTitle}>By Category</Typography>
          <View style={styles.breakdownContainer}>
            {categoryBreakdown.map((cat) => (
              <View key={cat.category} style={styles.categoryPill}>
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={theme.colors.primary}
                />
                <Typography style={styles.categoryText}>{cat.label}</Typography>
                <Typography style={styles.categoryPercent}>
                  {cat.percentage}%
                </Typography>
              </View>
            ))}
          </View>
        </>
      )}

      {todayTotal === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="sparkles-outline"
            size={32}
            color={theme.colors.success}
          />
          <Typography style={styles.emptyText}>
            No spending recorded today!
          </Typography>
        </View>
      )}
    </GlassCard>
  );
};

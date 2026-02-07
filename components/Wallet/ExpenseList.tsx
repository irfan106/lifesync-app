import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useExpenses } from "@controllers/expense.controller";
import { IExpense } from "@interfaces/expense.interface";
import { ExpenseItem } from "./ExpenseItem";
import { Ionicons } from "@expo/vector-icons";

interface ExpenseListProps {
  onEditExpense?: (expense: IExpense) => void;
  limit?: number;
}

export const ExpenseList = ({ onEditExpense, limit = 5 }: ExpenseListProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { data: expenses, isLoading, error } = useExpenses();

  // Filter to show only today's expenses
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayExpenses =
    expenses?.filter((expense) => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    }) ?? [];

  // Sort by date descending (most recent first)
  const sortedExpenses = [...todayExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Limit displayed items
  const displayedExpenses = sortedExpenses.slice(0, limit);
  const hasMore = sortedExpenses.length > limit;

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: "700",
      color: theme.colors.text,
    },
    badge: {
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    badgeText: {
      fontSize: 11,
      color: theme.colors.secondary,
      fontWeight: "600",
    },
    viewAllContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    viewAll: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
      fontWeight: "500",
      letterSpacing: 0.5,
      textDecorationLine: "underline",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyTitle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.md,
      fontWeight: "600",
      marginBottom: 4,
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.sm,
      textAlign: "center",
    },
    viewMoreCard: {
      marginTop: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
    },
    viewMoreGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      gap: 8,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: "rgba(139, 92, 246, 0.2)",
    },
    viewMoreText: {
      color: theme.colors.secondary,
      fontWeight: "600",
      fontSize: theme.fontSize.sm,
    },
  });

  if (isLoading) {
    return (
      <GlassCard variant="featured">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={theme.colors.text}
            />
            <Typography style={styles.title}>Today's Expenses</Typography>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Typography style={styles.emptyText}>Loading expenses...</Typography>
        </View>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard variant="featured">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={theme.colors.text}
            />
            <Typography style={styles.title}>Today's Expenses</Typography>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.colors.error}
            style={{ marginBottom: 8 }}
          />
          <Typography style={[styles.emptyText, { color: theme.colors.error }]}>
            Failed to load expenses
          </Typography>
        </View>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="featured">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="receipt-outline"
            size={20}
            color={theme.colors.text}
          />
          <Typography style={styles.title}>Today's Expenses</Typography>
          {displayedExpenses.length > 0 && (
            <View style={styles.badge}>
              <Typography style={styles.badgeText}>
                {displayedExpenses.length}
              </Typography>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("/wallet/history")}>
          <View style={styles.viewAllContainer}>
            <Typography style={styles.viewAll}>View All</Typography>
            <Ionicons
              name="arrow-forward-outline"
              size={16}
              color={theme.colors.textMuted}
            />
          </View>
        </TouchableOpacity>
      </View>

      {displayedExpenses.length > 0 ? (
        <>
          <FlatList
            data={displayedExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem expense={item} onEdit={onEditExpense} />
            )}
            scrollEnabled={false}
          />
          {hasMore && (
            <TouchableOpacity
              style={styles.viewMoreCard}
              onPress={() => router.push("/wallet/history")}
            >
              <LinearGradient
                colors={["rgba(139, 92, 246, 0.1)", "rgba(59, 130, 246, 0.05)"]}
                style={styles.viewMoreGradient}
              >
                <Typography style={styles.viewMoreText}>
                  +{sortedExpenses.length - limit} more today
                </Typography>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={theme.colors.secondary}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="wallet-outline"
            size={48}
            color={theme.colors.textMuted}
            style={{ marginBottom: 8 }}
          />
          <Typography style={styles.emptyTitle}>No expenses today</Typography>
          <Typography style={styles.emptyText}>
            Tap the + button to add one
          </Typography>
        </View>
      )}
    </GlassCard>
  );
};

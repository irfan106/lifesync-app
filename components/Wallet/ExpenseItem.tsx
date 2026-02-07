import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { IExpense, EXPENSE_CATEGORIES } from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";
import { useDeleteExpense } from "@controllers/expense.controller";

interface ExpenseItemProps {
  expense: IExpense;
  onEdit?: (expense: IExpense) => void;
}

export const ExpenseItem = ({ expense, onEdit }: ExpenseItemProps) => {
  const theme = useTheme();
  const deleteExpense = useDeleteExpense();

  const categoryInfo = EXPENSE_CATEGORIES.find(
    (c) => c.value === expense.category,
  );
  const categoryIcon = categoryInfo?.icon || "cube-outline";
  const categoryLabel = categoryInfo?.label || expense.category;

  const expenseDate = new Date(expense.date);
  const timeString = expenseDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleDelete = () => {
    deleteExpense.mutate(expense.id);
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      overflow: "hidden",
    },
    gradient: {
      padding: theme.spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    category: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: theme.fontSize.md,
    },
    note: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      marginTop: 2,
    },
    time: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.xs,
      marginTop: 2,
    },
    rightSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    amount: {
      color: theme.colors.pink,
      fontWeight: "700",
      fontSize: theme.fontSize.lg,
    },
    actionButton: {
      padding: 8,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onEdit?.(expense)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={categoryIcon as any}
              size={22}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <Typography style={styles.category}>{categoryLabel}</Typography>
            {expense.note && (
              <Typography style={styles.note}>{expense.note}</Typography>
            )}
            <Typography style={styles.time}>{timeString}</Typography>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Typography style={styles.amount}>
            -₹{expense.amount.toFixed(2)}
          </Typography>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(expense)}
            >
              <Ionicons
                name="pencil-outline"
                size={16}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

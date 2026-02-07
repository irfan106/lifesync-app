import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import { useTasks } from "@controllers/task.controller";
import { useExpenses } from "@controllers/expense.controller";

// Circular Progress Component
const CircularProgress = ({
  progress,
  size = 48,
  strokeWidth = 4,
  color = "#3B82F6",
  bgColor = "rgba(255, 255, 255, 0.1)",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        stroke={bgColor}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <Circle
        stroke={color}
        fill="none"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};

export const QuickStats = () => {
  const theme = useTheme();
  const { data: tasks = [] } = useTasks();
  const { data: expenses = [] } = useExpenses();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter((task) => {
    const taskDate = new Date(task.scheduledFor);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const completedToday = todaysTasks.filter((t) => t.isCompleted).length;
  const totalToday = todaysTasks.length;
  const taskProgress = totalToday > 0 ? completedToday / totalToday : 0;

  const todaysExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    expenseDate.setHours(0, 0, 0, 0);
    return expenseDate.getTime() === today.getTime();
  });

  const totalSpentToday = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 12,
    },
    // Glass stat card
    statCard: {
      flex: 1,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
    cardContent: {
      flex: 1,
      padding: 16,
      flexDirection: "row", // Side by side
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 100, // Slightly shorter is fine for row
    },
    // Left Column (Text)
    textColumn: {
      flex: 1,
      justifyContent: "center",
      gap: 4,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    label: {
      fontSize: 13,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    subLabel: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.5)",
      marginTop: 2,
    },
    // Right Column (Visual)
    visualColumn: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    // Specifics
    progressContainer: {
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    progressValue: {
      position: "absolute",
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    moneyValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <View style={styles.container}>
      {/* Tasks Card */}
      <GlassCard variant="featured" style={{ flex: 1 }} noPadding>
        <View style={styles.cardContent}>
          {/* Left: Info */}
          <View style={styles.textColumn}>
            <View style={styles.labelRow}>
              <Ionicons
                name="checkbox-outline"
                size={16}
                color={theme.colors.text}
              />
              <Typography style={styles.label}>Tasks</Typography>
            </View>
            <Typography style={styles.subLabel}>
              {completedToday}/{totalToday} done
            </Typography>
          </View>

          {/* Right: Ring */}
          <View style={styles.visualColumn}>
            <View style={styles.progressContainer}>
              <CircularProgress
                progress={taskProgress}
                size={48}
                strokeWidth={4}
                color={taskProgress === 1 ? "#10B981" : "#3B82F6"}
              />
              <Typography style={styles.progressValue}>
                {Math.round(taskProgress * 100)}%
              </Typography>
            </View>
          </View>
        </View>
      </GlassCard>

      {/* Spent Card */}
      <GlassCard variant="featured" style={{ flex: 1 }} noPadding>
        <View style={styles.cardContent}>
          {/* Left: Info */}
          <View style={styles.textColumn}>
            <View style={styles.labelRow}>
              <Ionicons
                name="cash-outline"
                size={16}
                color={theme.colors.text}
              />
              <Typography style={styles.label}>Spent</Typography>
            </View>
            <Typography style={styles.subLabel}>Today</Typography>
          </View>

          {/* Right: Value */}
          <View style={styles.visualColumn}>
            <Typography style={styles.moneyValue}>
              ₹{totalSpentToday.toFixed(0)}
            </Typography>
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

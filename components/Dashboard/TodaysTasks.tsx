import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useTasks } from "@controllers/task.controller";
import { Ionicons } from "@expo/vector-icons";

// Priority color mapping
const PRIORITY_COLORS = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
  default: "#3B82F6",
};

export const TodaysTasks = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: tasks = [], isLoading } = useTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks
    .filter((task) => {
      const taskDate = new Date(task.scheduledFor);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    })
    .slice(0, 4);

  const completedCount = todaysTasks.filter((t) => t.isCompleted).length;
  const totalCount = todaysTasks.length;

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
      marginBottom: theme.spacing.md,
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
    badge: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    badgeText: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    viewAll: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.xs,
      fontWeight: "500",
      letterSpacing: 0.5,
    },
    tasksList: {
      gap: 8,
    },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.35)", // Top Highlight
      borderLeftColor: "rgba(255, 255, 255, 0.2)", // Left Highlight
    },
    priorityDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 12,
    },
    statusIcon: {
      marginRight: 12,
    },
    taskContent: {
      flex: 1,
    },
    taskText: {
      color: theme.colors.text,
      fontSize: theme.fontSize.sm,
      fontWeight: "500",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: theme.colors.textMuted,
    },
    taskMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 4,
    },
    time: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.xs,
    },
    category: {
      backgroundColor: "rgba(59, 130, 246, 0.15)", // Matching Blue
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
    },
    categoryText: {
      color: theme.colors.primary, // Matching Blue
      fontSize: 10,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyEmoji: {
      fontSize: 40,
      marginBottom: theme.spacing.sm,
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
    viewAllContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
  });

  const getPriorityColor = (priority?: string) => {
    return (
      PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] ||
      PRIORITY_COLORS.default
    );
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <GlassCard variant="featured">
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="clipboard-outline"
            size={20}
            color={theme.colors.text}
          />
          <Typography style={styles.title}>Today's Tasks</Typography>
          {totalCount > 0 && (
            <View style={styles.badge}>
              <Typography style={styles.badgeText}>
                {completedCount}/{totalCount}
              </Typography>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("/tasks")}>
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

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Typography style={styles.emptyText}>Loading...</Typography>
        </View>
      ) : todaysTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={48}
            color={theme.colors.textMuted}
            style={{ marginBottom: 8 }}
          />
          <Typography style={styles.emptyTitle}>All caught up!</Typography>
          <Typography style={styles.emptyText}>
            No tasks scheduled for today.{"\n"}Enjoy your free time!
          </Typography>
        </View>
      ) : (
        <View style={styles.tasksList}>
          {todaysTasks.map((task) => (
            <LinearGradient
              key={task.id}
              colors={
                task.isCompleted
                  ? ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"] // Dimmed if done
                  : ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"] // Bright liquid if pending
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.taskItem,
                task.isCompleted && {
                  opacity: 0.6,
                  borderColor: "transparent",
                },
              ]}
            >
              {/* Status Indicator: Dot (Pending) or Check (Done) */}
              <View style={{ width: 20, alignItems: "center", marginRight: 8 }}>
                {task.isCompleted ? (
                  <Ionicons name="checkmark-sharp" size={18} color="#10B981" />
                ) : (
                  <View
                    style={[
                      styles.priorityDot,
                      {
                        backgroundColor: getPriorityColor(
                          (task as any).priority,
                        ),
                        marginRight: 0, // Reset margin as container handles it
                      },
                    ]}
                  />
                )}
              </View>
              <View style={styles.taskContent}>
                <Typography
                  style={[
                    styles.taskText,
                    task.isCompleted && styles.completedText,
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Typography>
                <View style={styles.taskMeta}>
                  <Typography style={styles.time}>
                    {formatTime(task.scheduledFor)}
                  </Typography>
                  {task.category && (
                    <View style={styles.category}>
                      <Typography style={styles.categoryText}>
                        {task.category}
                      </Typography>
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}
    </GlassCard>
  );
};

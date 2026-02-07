import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useTasks } from "@controllers/task.controller";
import { TaskItem } from "./TaskItem";
import { ITask } from "@interfaces/task.interface";
import { Ionicons } from "@expo/vector-icons";

interface TaskListProps {
  onEditTask: (task: ITask) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const theme = useTheme();
  const { data: tasks, isLoading } = useTasks();

  // Filter for Today's tasks only
  const todayTasks =
    tasks?.filter((t) => {
      const d = new Date(t.scheduledFor);
      const today = new Date();
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }) || [];

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
  });

  if (isLoading) return <Typography>Loading tasks...</Typography>;

  return (
    <View style={{ marginBottom: 100 }}>
      <GlassCard variant="featured">
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name="checkbox-outline"
              size={20}
              color={theme.colors.text}
            />
            <Typography style={styles.title}>All Actions</Typography>
            {todayTasks.length > 0 && (
              <View style={styles.badge}>
                <Typography style={styles.badgeText}>
                  {todayTasks.filter((t) => t.isCompleted).length}/
                  {todayTasks.length}
                </Typography>
              </View>
            )}
          </View>
        </View>

        {todayTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={48}
              color={theme.colors.textMuted}
              style={{ marginBottom: 8 }}
            />
            <Typography style={styles.emptyTitle}>All caught up!</Typography>
            <Typography style={styles.emptyText}>
              No tasks scheduled for today.
            </Typography>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            {todayTasks.map((item) => (
              <TaskItem key={item.id} task={item} onEdit={onEditTask} />
            ))}
          </View>
        )}
      </GlassCard>
    </View>
  );
};

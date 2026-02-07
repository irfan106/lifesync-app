import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { ITask } from "@interfaces/task.interface";
import { Ionicons } from "@expo/vector-icons";
import { useToggleTask, useDeleteTask } from "@controllers/task.controller";
import { LinearGradient } from "expo-linear-gradient";

interface TaskItemProps {
  task: ITask;
  onEdit: (task: ITask) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const theme = useTheme();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const handleDelete = () => {
    Alert.alert(
      "Delete Task",
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTask.mutate(task.id),
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.35)",
      borderLeftColor: "rgba(255, 255, 255, 0.2)",
    },
    checkbox: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      borderWidth: 2,
    },
    checkboxUnchecked: {
      borderColor: "rgba(255, 255, 255, 0.3)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    checkboxChecked: {
      borderColor: "#10B981",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      // Glow effect
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
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
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    categoryText: {
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    actionBtn: {
      padding: 6,
      borderRadius: 8,
    },
    deleteBtn: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
  });

  const getCategoryIcon = (cat?: string): keyof typeof Ionicons.glyphMap => {
    switch (cat?.toLowerCase()) {
      case "work":
        return "briefcase-outline";
      case "health":
        return "fitness-outline";
      case "learning":
        return "book-outline";
      case "finance":
        return "wallet-outline";
      case "personal":
        return "person-outline";
      default:
        return "bookmark-outline";
    }
  };

  const timeStr = new Date(task.scheduledFor).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <LinearGradient
      colors={
        task.isCompleted
          ? ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
          : ["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.taskItem, task.isCompleted && { opacity: 0.7 }]}
    >
      {/* Premium Checkbox with Loading State */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          task.isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
        onPress={() =>
          toggleTask.mutate({
            taskId: task.id,
            currentStatus: task.isCompleted,
          })
        }
        disabled={toggleTask.isPending}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {toggleTask.isPending ? (
          <ActivityIndicator
            size="small"
            color={task.isCompleted ? "#10B981" : theme.colors.textMuted}
          />
        ) : task.isCompleted ? (
          <Ionicons name="checkmark" size={16} color="#10B981" />
        ) : null}
      </TouchableOpacity>

      {/* Task Content */}
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onEdit(task)}
        activeOpacity={0.7}
      >
        <Typography
          style={[styles.taskText, task.isCompleted && styles.completedText]}
          numberOfLines={1}
        >
          {task.title}
        </Typography>
        <View style={styles.taskMeta}>
          <Typography style={styles.time}>{timeStr}</Typography>
          {task.category && (
            <View style={styles.category}>
              <Ionicons
                name={getCategoryIcon(task.category)}
                size={10}
                color={theme.colors.primary}
                style={{ marginRight: 4 }}
              />
              <Typography style={styles.categoryText}>
                {task.category}
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Buttons with Loading States */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => onEdit(task)}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.actionBtn, styles.deleteBtn]}
          disabled={deleteTask.isPending}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {deleteTask.isPending ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

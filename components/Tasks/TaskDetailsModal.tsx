import React from "react";
import { View, StyleSheet } from "react-native";
import { GorhomBottomSheet } from "@design-system/GorhomBottomSheet";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { ITask } from "@interfaces/task.interface";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@design-system/Button";

interface TaskDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  task: ITask | null;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  onClose,
  task,
}) => {
  const theme = useTheme();

  if (!task) return null;

  const isOverdue =
    !task.isCompleted && new Date(task.scheduledFor).getTime() < Date.now();

  const styles = StyleSheet.create({
    container: {
      gap: 20,
    },
    header: {
      alignItems: "center",
      gap: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    completedBadge: {
      backgroundColor: "rgba(16, 185, 129, 0.2)",
    },
    missedBadge: {
      backgroundColor: "rgba(239, 68, 68, 0.2)",
    },
    pendingBadge: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
    badgeText: {
      fontWeight: "600",
      fontSize: 12,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    detailLabel: {
      color: theme.colors.textMuted,
      fontSize: 13,
      fontWeight: "500",
    },
    detailValue: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "600",
      textAlign: "right",
      maxWidth: "60%",
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
      color: "#fff",
    },
  });

  const getStatusInfo = () => {
    if (task.isCompleted) {
      return {
        label: "Completed",
        color: "#10B981",
        icon: "checkmark-circle" as const,
      };
    } else if (isOverdue) {
      return {
        label: "Missed",
        color: "#EF4444",
        icon: "close-circle" as const,
      };
    } else {
      return {
        label: "Pending",
        color: theme.colors.primary,
        icon: "time-outline" as const,
      };
    }
  };

  const status = getStatusInfo();

  return (
    <GorhomBottomSheet visible={visible} onClose={onClose} snapPoints={["55%"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Typography style={styles.title}>{task.title}</Typography>
          <View
            style={[
              styles.statusBadge,
              task.isCompleted
                ? styles.completedBadge
                : isOverdue
                  ? styles.missedBadge
                  : styles.pendingBadge,
            ]}
          >
            <Ionicons name={status.icon} size={14} color={status.color} />
            <Typography style={[styles.badgeText, { color: status.color }]}>
              {status.label}
            </Typography>
          </View>
        </View>

        {/* Details */}
        <View>
          {task.category && (
            <View style={styles.detailRow}>
              <Typography style={styles.detailLabel}>Category</Typography>
              <Typography
                style={[styles.detailValue, { textTransform: "capitalize" }]}
              >
                {task.category}
              </Typography>
            </View>
          )}
          <View style={styles.detailRow}>
            <Typography style={styles.detailLabel}>Deadline</Typography>
            <Typography style={styles.detailValue}>
              {new Date(task.scheduledFor).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
          </View>
          {task.completedAt && (
            <View style={styles.detailRow}>
              <Typography style={styles.detailLabel}>Completed At</Typography>
              <Typography style={styles.detailValue}>
                {new Date(task.completedAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Typography>
            </View>
          )}
          <View style={styles.detailRow}>
            <Typography style={styles.detailLabel}>Status</Typography>
            <Typography style={[styles.detailValue, { color: status.color }]}>
              {status.label}
            </Typography>
          </View>
        </View>

        {/* Close Button */}
        <Button title="Close" variant="outline" onPress={onClose} />
      </View>
    </GorhomBottomSheet>
  );
};

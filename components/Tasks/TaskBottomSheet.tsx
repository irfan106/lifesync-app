import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { GlassDatePicker } from "./ui";
import { GorhomBottomSheet } from "@design-system/GorhomBottomSheet";
import { TextInput } from "@design-system/TextInput";
import { Button } from "@design-system/Button";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { useAddTask, useUpdateTask } from "@controllers/task.controller";
import { Ionicons } from "@expo/vector-icons";

interface Task {
  id: string;
  title: string; // "Task" mapped to title
  category?: string;
  scheduledFor: string; // ISO date string
  isCompleted: boolean;
}

interface TaskBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  task?: Task | null; // If provided, edit mode. Else, create mode.
}

const CATEGORIES = [
  { label: "Work", value: "work", icon: "briefcase-outline" as const },
  { label: "Health", value: "health", icon: "fitness-outline" as const },
  { label: "Personal", value: "personal", icon: "person-outline" as const },
  { label: "Learning", value: "learning", icon: "book-outline" as const },
  { label: "Finance", value: "finance", icon: "wallet-outline" as const },
];

export const TaskBottomSheet: React.FC<TaskBottomSheetProps> = ({
  visible,
  onClose,
  task,
}) => {
  const theme = useTheme();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [deadline, setDeadline] = useState(new Date());

  // Reset form when task prop changes or becomes visible
  useEffect(() => {
    if (visible) {
      if (task) {
        setTitle(task.title);
        setCategory(task.category || "");
        setDeadline(new Date(task.scheduledFor));
      } else {
        // New Task Defaults
        setTitle("");
        setCategory("");
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        setDeadline(endOfDay);
      }
    }
  }, [visible, task]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your task.");
      return;
    }

    const payload = {
      title: title.trim(),
      category: (category || undefined) as any,
      scheduledFor: deadline.toISOString(),
    };

    if (task) {
      // Edit Mode
      updateTask.mutate(
        { taskId: task.id, updates: payload },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      // Create Mode
      addTask.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isEditing = !!task;

  const styles = StyleSheet.create({
    form: {
      gap: theme.spacing.lg,
    },
    sectionLabel: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
    },
    categoryRow: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    categoryChip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    activeChip: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: theme.colors.primary,
    },
    chipText: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: "500",
    },
    activeChipText: {
      color: "#fff",
      fontWeight: "600",
    },
    actions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: 8,
      marginBottom: 30,
    },
  });

  return (
    <GorhomBottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["85%"]}
      enableScroll
    >
      <View style={styles.form}>
        {/* Custom Header matching Time Capsule */}
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name={isEditing ? "create-outline" : "rocket-outline"}
              size={24}
              color={theme.colors.text}
            />
            <Typography
              variant="h3"
              style={{ fontWeight: "800", fontSize: 24 }}
            >
              {isEditing ? "Modify Focus" : "Set New Focus"}
            </Typography>
          </View>
          <Typography
            style={{
              color: theme.colors.textMuted,
              fontSize: 14,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {isEditing
              ? "Update your progress and commitment."
              : "Define a task to sharp your daily routine."}
          </Typography>
        </View>

        <TextInput
          label="Task Title"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
        />

        <View>
          <Typography style={styles.sectionLabel}>
            Category (Optional)
          </Typography>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  activeOpacity={0.7}
                  style={[styles.categoryChip, isSelected && styles.activeChip]}
                  onPress={() => setCategory(isSelected ? "" : cat.value)}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={isSelected ? "#fff" : theme.colors.textSecondary}
                  />
                  <Typography
                    style={[
                      styles.chipText,
                      isSelected && styles.activeChipText,
                    ]}
                  >
                    {cat.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date & Time Row with Explanation */}
        <View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Date"
                value={deadline}
                onChange={setDeadline}
                mode="date"
                minimumDate={new Date()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Time"
                value={deadline}
                onChange={setDeadline}
                mode="time"
              />
            </View>
          </View>
          <Typography
            variant="caption"
            style={{
              color: theme.colors.textMuted,
              marginTop: 8,
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            * Strict Policy: Tasks cannot be marked as completed once the
            deadline passes.
          </Typography>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <Button
            title={isEditing ? "Update Task" : "Create Task"}
            icon={
              <Ionicons
                name={isEditing ? "pencil" : "add-circle-outline"}
                size={18}
                color="#FFF"
              />
            }
            onPress={handleSubmit}
            loading={isEditing ? updateTask.isPending : addTask.isPending}
            style={{ flex: 1 }}
          />
        </View>

        {isEditing && (
          <Typography
            variant="caption"
            style={{
              textAlign: "center",
              marginTop: -12, // Pull up to stay close to buttons
              color: theme.colors.textMuted,
              opacity: 0.8,
            }}
          >
            Tasks can only be completed, never aborted.
          </Typography>
        )}
      </View>
    </GorhomBottomSheet>
  );
};

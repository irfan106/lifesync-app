import React, { useState } from "react";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import {
  TaskList,
  TaskBottomSheet,
  EfficiencyChart,
  TasksHeader,
} from "@components/Tasks";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ITask } from "@interfaces/task.interface";

export default function TasksScreen() {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);

  const handleEdit = (task: ITask) => {
    setEditingTask(task);
    setSheetVisible(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setSheetVisible(true);
  };

  const handleClose = () => {
    setSheetVisible(false);
    setEditingTask(null);
  };

  const styles = StyleSheet.create({
    content: {
      paddingTop: theme.spacing.md,
      gap: theme.spacing.lg,
      paddingBottom: 100, // Space for FAB
    },
    fab: {
      position: "absolute",
      bottom: 110,
      right: 20,
      borderRadius: 30,
      // Glass border highlights
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderTopColor: "rgba(255, 255, 255, 0.45)",
      borderLeftColor: "rgba(255, 255, 255, 0.25)",
      overflow: "hidden",
      // Glass shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    fabGlass: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <GlassBackground>
      <Container safeArea transparent>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TasksHeader />
          <EfficiencyChart />
          <TaskList onEditTask={handleEdit} />
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.7}
          onPress={handleCreate}
        >
          <View style={styles.fabGlass}>
            <Ionicons name="add" size={32} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        <TaskBottomSheet
          visible={sheetVisible}
          onClose={handleClose}
          task={editingTask}
        />
      </Container>
    </GlassBackground>
  );
}

import React, { useState, useMemo } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput as RNTextInput,
  Alert,
} from "react-native";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import { GlassCard } from "@design-system/GlassCard";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { useTasks } from "@controllers/task.controller";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { ITask } from "@interfaces/task.interface";
import { LinearGradient } from "expo-linear-gradient";
import { useExportHistory } from "@hooks/useExportHistory";
import { TaskDetailsModal } from "@components/Tasks/TaskDetailsModal";

type DateFilter =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "This Month"
  | "Last 7 Days"
  | "Last 30 Days"
  | "All Time";
type StatusFilter = "All" | "Completed" | "Missed";

const DATE_FILTERS: DateFilter[] = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last 7 Days",
  "Last 30 Days",
  "All Time",
];

const STATUS_FILTERS: StatusFilter[] = ["All", "Completed", "Missed"];

export default function HistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: tasks = [], isLoading } = useTasks();
  const { exportTasks, isExporting } = useExportHistory();

  const [dateFilter, setDateFilter] = useState<DateFilter>("All Time");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

  const handleExport = () => {
    Alert.alert("Export Format", "Choose your preferred format:", [
      { text: "Cancel", style: "cancel" },
      { text: "JSON", onPress: () => exportTasks(filteredTasks, "json") },
      { text: "CSV", onPress: () => exportTasks(filteredTasks, "csv") },
    ]);
  };

  // Helper: Check if date is in range
  const isInDateRange = (taskDate: Date, filter: DateFilter): boolean => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDay = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate(),
    );

    switch (filter) {
      case "Today":
        return taskDay.getTime() === today.getTime();
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return taskDay.getTime() === yesterday.getTime();
      case "This Week":
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return taskDay >= weekStart && taskDay <= today;
      case "This Month":
        return (
          taskDate.getMonth() === now.getMonth() &&
          taskDate.getFullYear() === now.getFullYear()
        );
      case "Last 7 Days":
        const days7Ago = new Date(today);
        days7Ago.setDate(days7Ago.getDate() - 7);
        return taskDay >= days7Ago;
      case "Last 30 Days":
        const days30Ago = new Date(today);
        days30Ago.setDate(days30Ago.getDate() - 30);
        return taskDay >= days30Ago;
      case "All Time":
      default:
        return true;
    }
  };

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((t: ITask) => {
      // 1. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesCategory = t.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory) return false;
      }

      // 2. Status Filter
      if (statusFilter === "Completed" && !t.isCompleted) return false;
      if (statusFilter === "Missed") {
        const isOverdue = new Date(t.scheduledFor).getTime() < Date.now();
        if (t.isCompleted || !isOverdue) return false;
      }

      // 3. Date Filter
      if (!isInDateRange(new Date(t.scheduledFor), dateFilter)) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, dateFilter]);

  // Stats Calculation
  const stats = useMemo(() => {
    const completed = filteredTasks.filter((t: ITask) => t.isCompleted).length;
    const missed = filteredTasks.filter(
      (t: ITask) =>
        !t.isCompleted && new Date(t.scheduledFor).getTime() < Date.now(),
    ).length;
    const total = filteredTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, missed, total, rate };
  }, [filteredTasks]);

  // Group tasks by date
  const sections = useMemo(() => {
    const grouped = filteredTasks.reduce((acc: any, task: ITask) => {
      const date = new Date(task.scheduledFor).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(task);
      return acc;
    }, {});

    return Object.keys(grouped)
      .map((date) => ({
        title: date,
        data: grouped[date],
      }))
      .sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime(),
      );
  }, [filteredTasks]);

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingBottom: 8,
      gap: 16,
    },
    searchContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
    },
    searchInput: {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: "#fff",
      fontSize: 14,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    filterRow: {
      marginBottom: 12,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      marginRight: 8,
    },
    activePill: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: theme.colors.primary,
    },
    pillText: {
      fontSize: 12,
      color: "rgba(255,255,255,0.6)",
      fontWeight: "500",
    },
    activePillText: {
      color: "#fff",
      fontWeight: "700",
    },
    statsCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "800",
      color: "#fff",
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.textMuted,
      marginTop: 4,
      textTransform: "uppercase",
      fontWeight: "600",
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: "rgba(0,0,0,0.4)",
      marginTop: 8,
      borderRadius: 8,
      marginHorizontal: 16,
    },
    sectionTitle: {
      color: theme.colors.primary,
      fontWeight: "700",
      textTransform: "uppercase",
      fontSize: 11,
      letterSpacing: 1,
    },
    itemContainer: {
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 16,
      overflow: "hidden",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: 16,
    },
    statusBar: {
      width: 4,
      height: 36,
      borderRadius: 2,
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontWeight: "500",
      fontSize: 14,
    },
    meta: {
      flexDirection: "row",
      gap: 8,
      marginTop: 4,
      alignItems: "center",
    },
    badge: {
      fontSize: 10,
      color: theme.colors.primary,
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    timeText: {
      fontSize: 10,
      color: theme.colors.textMuted,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      textAlign: "center",
      marginTop: 16,
    },
  });

  const FilterPill = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.pill, active && styles.activePill]}
      onPress={onPress}
    >
      <Typography style={[styles.pillText, active && styles.activePillText]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="file-tray-outline"
        size={64}
        color={theme.colors.textMuted}
      />
      <Typography style={styles.emptyText}>
        No tasks found for the selected filters.{"\n"}Try adjusting your search
        or filters.
      </Typography>
    </View>
  );

  return (
    <GlassBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <Container safeArea transparent style={{ padding: 0 }}>
        {/* Header */}
        <View style={[styles.header, { justifyContent: "space-between" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Typography variant="h2" style={{ fontWeight: "800" }}>
              Task History
            </Typography>
          </View>
          <TouchableOpacity
            onPress={handleExport}
            style={{
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 12,
            }}
            disabled={isExporting}
          >
            <Ionicons
              name={isExporting ? "hourglass-outline" : "share-outline"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={{ position: "relative" }}>
            <Ionicons
              name="search-outline"
              size={18}
              color={theme.colors.textMuted}
              style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}
            />
            <RNTextInput
              style={[styles.searchInput, { paddingLeft: 42 }]}
              placeholder="Search by title or category..."
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          >
            {DATE_FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={dateFilter === f}
                onPress={() => setDateFilter(f)}
              />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row" }}
          >
            {STATUS_FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={statusFilter === f}
                onPress={() => setStatusFilter(f)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Task List */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>{title}</Typography>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedTask(item)}
              style={styles.itemContainer}
            >
              <LinearGradient
                colors={
                  item.isCompleted
                    ? ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
                    : ["rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.04)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.item, item.isCompleted && { opacity: 0.7 }]}
              >
                <View
                  style={[
                    styles.statusBar,
                    {
                      backgroundColor: item.isCompleted ? "#10B981" : "#EF4444",
                    },
                  ]}
                />
                <View style={styles.itemContent}>
                  <Typography
                    style={[
                      styles.itemTitle,
                      {
                        textDecorationLine: item.isCompleted
                          ? "line-through"
                          : "none",
                        color: item.isCompleted
                          ? theme.colors.textMuted
                          : "#fff",
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Typography>
                  <View style={styles.meta}>
                    {item.category && (
                      <Typography style={styles.badge}>
                        {item.category}
                      </Typography>
                    )}
                    <Typography style={styles.timeText}>
                      {new Date(item.scheduledFor).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </View>
                </View>
                <Ionicons
                  name={item.isCompleted ? "checkmark-circle" : "close-circle"}
                  size={22}
                  color={item.isCompleted ? "#10B981" : "#EF4444"}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        {/* Task Details Modal */}
        <TaskDetailsModal
          visible={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      </Container>
    </GlassBackground>
  );
}

import React, { useState } from "react";
import { View, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@design-system/Typography";
import { GlassCard } from "@design-system/GlassCard";
import { useTheme } from "@context/ThemeContext";
import { useTasks } from "@controllers/task.controller";
import { ITask } from "@interfaces/task.interface";

const { width } = Dimensions.get("window");

export const EfficiencyChart = () => {
  const theme = useTheme();
  const [range, setRange] = useState<"Week" | "Month">("Week");
  const { data: tasks = [], isLoading } = useTasks();

  // Calculate Efficiency for last 7 days
  const calculateWeeklyData = () => {
    const today = new Date();
    const labels: string[] = [];
    const dataPoints: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));

      // Filter tasks for this day
      const dayTasks = tasks.filter((t: ITask) => {
        const tDate = new Date(t.scheduledFor);
        return (
          tDate.getDate() === d.getDate() &&
          tDate.getMonth() === d.getMonth() &&
          tDate.getFullYear() === d.getFullYear()
        );
      });

      if (dayTasks.length === 0) {
        dataPoints.push(0); // Or null? let's say 0 efficiency if no tasks
      } else {
        const completed = dayTasks.filter((t: ITask) => t.isCompleted).length;
        const efficiency = (completed / dayTasks.length) * 100;
        dataPoints.push(Math.round(efficiency));
      }
    }
    return { labels, dataPoints };
  };

  const weeklyData = calculateWeeklyData();

  const data = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.dataPoints,
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#1E1E1E",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#1E1E1E",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.7})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // Fix potential crash on some versions
    decimalPlaces: 0,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#8B5CF6",
    },
  };

  const styles = StyleSheet.create({
    container: {
      // Container handled by GlassCard
    },
    gradient: {
      padding: theme.spacing.md,
      paddingBottom: 0,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
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
    subtitle: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.xs,
      marginTop: 2,
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: "rgba(0,0,0,0.2)",
      borderRadius: 12,
      padding: 2,
    },
    tab: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
    },
    activeTab: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    tabText: {
      fontSize: 12,
      color: "rgba(255,255,255,0.5)",
    },
    activeTabText: {
      color: "#fff",
      fontWeight: "600",
    },
  });

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { height: 220, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <GlassCard variant="featured" noPadding>
      <View style={styles.gradient}>
        <View style={styles.header}>
          <View>
            <Typography style={styles.title}>Efficiency</Typography>
            <Typography variant="caption" style={styles.subtitle}>
              Completion Rate (Last 7 Days)
            </Typography>
          </View>
          {/* Placeholder Tabs - Functionality could be expanded */}
          <View style={styles.tabs}>
            {["Week"].map((t) => (
              <View
                key={t}
                style={[styles.tab, range === t && styles.activeTab]}
              >
                <Typography
                  style={[styles.tabText, range === t && styles.activeTabText]}
                >
                  {t}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <LineChart
          data={data}
          width={width - 56} // width - padding
          height={180}
          chartConfig={{
            ...chartConfig,
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(255, 255, 255, ${opacity * 0.7})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: theme.colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            paddingRight: 40,
          }}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          yAxisSuffix="%"
          yAxisInterval={25}
        />
      </View>
    </GlassCard>
  );
};

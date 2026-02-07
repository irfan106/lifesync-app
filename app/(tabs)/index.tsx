import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import {
  Greeting,
  QuickStats,
  TodaysTasks,
  WeeklySummary,
  VisionBoard,
} from "@components/Dashboard";
import { FutureSelfNoteConfig } from "@components/Tasks";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@context/ThemeContext";

export default function Dashboard() {
  const theme = useTheme();

  const styles = StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl + 80,
      paddingTop: theme.spacing.md,
    },
  });

  return (
    <GlassBackground>
      <Container safeArea transparent>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Greeting />
          <QuickStats />
          <TodaysTasks />
          <WeeklySummary />
          <FutureSelfNoteConfig />
          <VisionBoard />
        </ScrollView>
      </Container>
    </GlassBackground>
  );
}

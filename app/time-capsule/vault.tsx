import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useTimeCapsules,
  CapsuleMood,
} from "@controllers/timeCapsule.controller";

const { width } = Dimensions.get("window");
const COLUMN_Gap = 16;
const CARD_WIDTH = (width - 48 - COLUMN_Gap) / 2; // Padding 24 * 2 = 48

const MOOD_COLORS: Record<CapsuleMood, string> = {
  motivation: "#F59E0B",
  reflection: "#3B82F6",
  celebration: "#EC4899",
  random: "#10B981",
};

export default function TimeCapsuleVaultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { top } = useSafeAreaInsets(); // Get safe area
  const { data: capsules = [] } = useTimeCapsules();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isLocked = new Date() < new Date(item.unlockDate);
    const color = MOOD_COLORS[item.mood as CapsuleMood] || MOOD_COLORS.random;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            marginTop: index % 2 !== 0 ? 24 : 0, // Staggered Grid Effect
          },
        ]}
      >
        {isLocked && (
          <View style={styles.lockedOverlay}>
            <View style={styles.lockIconContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </View>
            <Typography style={styles.unlockLabel}>UNLOCKS</Typography>
            <Typography style={styles.unlockDate}>
              {new Date(item.unlockDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Typography>
            <Typography style={styles.unlockYear}>
              {new Date(item.unlockDate).getFullYear()}
            </Typography>
          </View>
        )}

        <LinearGradient
          colors={[color + "20", "rgba(255,255,255,0.02)"]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.moodDot,
                { backgroundColor: color, shadowColor: color },
              ]}
            />
            {!isLocked && (
              <Ionicons
                name="mail-open-outline"
                size={16}
                color="rgba(255,255,255,0.4)"
              />
            )}
          </View>

          <Typography style={styles.messageText} numberOfLines={6}>
            {item.message}
          </Typography>

          <View style={styles.cardFooter}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons
                name="time-outline"
                size={10}
                color="rgba(255,255,255,0.3)"
              />
              <Typography style={styles.dateText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Typography>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background */}
      <LinearGradient
        colors={["#0F172A", "#1E1B4B", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header with Dynamic Top Padding */}
      <View style={[styles.header, { paddingTop: top + 16 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Typography variant="h3" style={styles.headerTitle}>
            Time Vault 🔐
          </Typography>
          <Typography style={styles.headerSubtitle}>
            Your messages to the future
          </Typography>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={capsules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons
                name="finger-print"
                size={48}
                color="rgba(255,255,255,0.3)"
              />
            </View>
            <Typography variant="h3" style={{ color: "#fff", marginBottom: 8 }}>
              The Vault is Empty
            </Typography>
            <Typography style={styles.emptyText}>
              Seal a time capsule to see it appear here.
            </Typography>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontWeight: "700",
    color: "#FFF",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  listContent: {
    padding: 24,
    paddingTop: 12,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderTopColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 16,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  messageText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
  },
  cardFooter: {
    marginTop: 8,
  },
  dateText: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 10,
    fontWeight: "500",
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 15, 0.85)", // Glassy Dark
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
    // backdropFilter: "blur(10px)", // For web/supported
  },
  lockIconContainer: {
    marginBottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  unlockLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "700",
    marginBottom: 2,
  },
  unlockDate: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  unlockYear: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    opacity: 0.8,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 22,
  },
});

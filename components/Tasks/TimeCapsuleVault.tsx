import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import {
  useTimeCapsules,
  CapsuleMood,
} from "@controllers/timeCapsule.controller";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24;

const MOOD_COLORS: Record<CapsuleMood, string> = {
  motivation: "#F59E0B", // Amber
  reflection: "#3B82F6", // Blue
  celebration: "#EC4899", // Pink
  random: "#10B981", // Emerald
};

export const TimeCapsuleVault = () => {
  const theme = useTheme();
  const { data: capsules = [], isLoading } = useTimeCapsules();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    listContent: {
      gap: 16,
      paddingBottom: 24,
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
    card: {
      width: CARD_WIDTH,
      height: 180,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.15)",
      borderTopColor: "rgba(255,255,255,0.3)", // Glass Highlight
      backgroundColor: "rgba(255,255,255,0.05)", // Glass BG
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
    lockedOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(15, 15, 20, 0.95)", // Deep smooth dark
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    lockIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.05)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      marginBottom: 12,
    },
    unlockLabel: {
      color: theme.colors.textMuted,
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    unlockDate: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "700",
      textAlign: "center",
    },
    messageText: {
      color: "rgba(255,255,255,0.9)",
      fontSize: 14,
      lineHeight: 22,
    },
    moodDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      // elevation handled by parent gradient often enough
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 40,
      opacity: 0.7,
      padding: 32,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
      backgroundColor: "rgba(255,255,255,0.02)",
      marginHorizontal: 16,
    },
  });

  const renderItem = ({ item }: { item: any }) => {
    const isLocked = new Date() < new Date(item.unlockDate);
    const color = MOOD_COLORS[item.mood as CapsuleMood] || MOOD_COLORS.random;

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        {isLocked && (
          <View style={styles.lockedOverlay}>
            <View style={styles.lockIconContainer}>
              <Ionicons
                name="lock-closed"
                size={20}
                color="rgba(255,255,255,0.5)"
              />
            </View>
            <Typography style={styles.unlockLabel}>Unlock On</Typography>
            <Typography style={styles.unlockDate}>
              {new Date(item.unlockDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </View>
        )}

        <LinearGradient
          colors={[color + "15", "transparent"]}
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

          <Typography style={styles.messageText} numberOfLines={5}>
            {item.message}
          </Typography>

          <Typography
            variant="caption"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}
          >
            {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (capsules.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="sparkles-outline"
          size={48}
          color="rgba(255,255,255,0.2)"
          style={{ marginBottom: 16 }}
        />
        <Typography variant="h3" style={{ color: "#fff", marginBottom: 8 }}>
          Empty Vault
        </Typography>
        <Typography
          variant="body"
          style={{ color: theme.colors.textMuted, textAlign: "center" }}
        >
          Write a note to your future self to see it appear here.
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={capsules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

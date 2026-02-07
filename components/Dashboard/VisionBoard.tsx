import React, { useState, useRef } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { TextInput } from "@design-system/TextInput";
import { Button } from "@design-system/Button";
import { GlassCard } from "@design-system/GlassCard";
import {
  GorhomBottomSheet,
  GorhomBottomSheetRef,
} from "@design-system/GorhomBottomSheet";
import {
  useVisions,
  useAddVision,
  useDeleteVision,
} from "@controllers/vision.controller";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16; // Match container padding
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const GRADIENTS: [string, string][] = [
  ["#3B82F6", "#8B5CF6"],
  ["#8B5CF6", "#EC4899"],
  ["#EC4899", "#F97316"],
  ["#10B981", "#3B82F6"],
  ["#F97316", "#FBBF24"],
];

const EMOJIS = ["🎯", "💪", "🚀", "⭐", "💎", "🌟", "🎨", "💼", "🏆", "🌈"];

export const VisionBoard = () => {
  const theme = useTheme();
  const { data: visions = [], isLoading } = useVisions();
  const addVision = useAddVision();
  const deleteVision = useDeleteVision();
  const bottomSheetRef = useRef<GorhomBottomSheetRef>(null);
  const deleteSheetRef = useRef<GorhomBottomSheetRef>(null);

  const [newTitle, setNewTitle] = useState("");
  const [visionToDelete, setVisionToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const getGradient = (index: number) => GRADIENTS[index % GRADIENTS.length];
  const getEmoji = (index: number) => EMOJIS[index % EMOJIS.length];

  const openSheet = () => bottomSheetRef.current?.open();
  const closeSheet = () => bottomSheetRef.current?.close();

  const styles = StyleSheet.create({
    container: {
      // No bottom margin - parent handles spacing
    },
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
    titleIcon: {
      fontSize: 18,
    },
    title: {
      fontSize: theme.fontSize.lg,
      fontWeight: "700",
      color: theme.colors.text,
    },
    countBadge: {
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    countText: {
      fontSize: 11,
      color: "#A78BFA",
      fontWeight: "600",
    },
    addButton: {
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: theme.colors.secondary,
      paddingHorizontal: 16,
      paddingVertical: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    addButtonText: {
      color: theme.colors.secondary,
      fontWeight: "600",
      fontSize: 13,
    },
    listContainer: {
      // No extra padding - cards fill available space
    },
    card: {
      width: CARD_WIDTH,
      height: 140,
      marginBottom: CARD_GAP,
      borderRadius: 16,
      overflow: "hidden",
    },
    cardGradient: {
      flex: 1,
      padding: 14,
      justifyContent: "space-between",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    cardEmoji: {
      fontSize: 24,
    },
    deleteButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    deleteText: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: 14,
      fontWeight: "600",
      marginTop: -2,
    },
    cardBody: {
      flex: 1,
      justifyContent: "center",
    },
    cardTitle: {
      color: "#FFFFFF",
      fontWeight: "700",
      fontSize: 15,
      lineHeight: 20,
      marginBottom: 8,
    },
    cardFooter: {
      gap: 4,
    },
    progressBarBg: {
      height: 4,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 2,
    },
    progressText: {
      fontSize: 10,
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "500",
    },
    emptyCard: {
      width: width - 48, // Full width minus padding
      height: 140,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.15)",
      borderStyle: "dashed",
    },
    emptyBlur: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyEmoji: {
      fontSize: 28,
      marginBottom: 4,
    },
    emptyTitle: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: theme.fontSize.sm,
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.xs,
      marginTop: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      justifyContent: "center",
      padding: theme.spacing.lg,
    },
    modalContent: {
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    modalBlur: {
      padding: theme.spacing.xl,
    },
    modalTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    modalEmoji: {
      fontSize: 48,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    modalButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
  });

  const handleAddVision = () => {
    if (!newTitle.trim()) {
      Alert.alert("Error", "Please enter your dream");
      return;
    }
    addVision.mutate(
      { title: newTitle.trim() },
      {
        onSuccess: () => {
          closeSheet();
          setNewTitle("");
        },
      },
    );
  };

  const handleDelete = (vision: { id: string; title: string }) => {
    setVisionToDelete(vision);
    deleteSheetRef.current?.open();
  };

  const confirmDelete = () => {
    if (visionToDelete) {
      deleteVision.mutate(visionToDelete.id, {
        onSuccess: () => {
          deleteSheetRef.current?.close();
          setVisionToDelete(null);
        },
      });
    }
  };

  // Mock progress for now (random 0-100)
  const getProgress = (id: string) => {
    // Stable random based on ID char code sum
    const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return sum % 100;
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const progress = getProgress(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {}} // No action yet, but keeps touchable feel
        style={{ width: CARD_WIDTH, marginBottom: CARD_GAP }}
      >
        <GlassCard variant="featured" style={{ height: 140 }} noPadding>
          <View style={styles.cardGradient}>
            <View style={styles.cardHeader}>
              <Typography style={styles.cardEmoji}>
                {getEmoji(index)}
              </Typography>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete({ id: item.id, title: item.title })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Typography style={styles.deleteText}>×</Typography>
              </TouchableOpacity>
            </View>

            <View style={styles.cardBody}>
              <Typography style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Typography>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#8B5CF6", "#EC4899"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progress}%` }]}
                />
              </View>
              <Typography style={styles.progressText}>
                {progress}% achieved
              </Typography>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  // ... (existing imports/code)

  const renderEmptyCard = () => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={openSheet}
      style={{ width: width - 32, height: 140 }} // Full width minus padding
    >
      <GlassCard variant="featured" style={{ flex: 1 }}>
        <View style={styles.emptyBlur}>
          <Ionicons
            name="images-outline"
            size={48}
            color={theme.colors.textMuted}
            style={{ marginBottom: 8 }}
          />
          <Typography style={styles.emptyTitle}>
            Add your first dream
          </Typography>
          <Typography style={styles.emptyText}>
            What do you want to achieve?
          </Typography>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Typography style={styles.title}>Vision Board</Typography>
          {visions.length > 0 && (
            <View style={styles.countBadge}>
              <Typography style={styles.countText}>{visions.length}</Typography>
            </View>
          )}
        </View>
        {visions.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={openSheet}>
            <Typography style={styles.addButtonText}>+ Add</Typography>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <Typography style={{ color: theme.colors.textMuted, marginLeft: 24 }}>
          Loading...
        </Typography>
      ) : visions.length === 0 ? (
        renderEmptyCard()
      ) : (
        <FlatList
          data={visions}
          numColumns={2}
          key={2} // Force fresh render when changing columns
          columnWrapperStyle={{ gap: CARD_GAP }}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <GorhomBottomSheet
        ref={bottomSheetRef}
        title="Add a Dream ✨"
        snapPoints={["40%"]}
        onClose={() => setNewTitle("")}
      >
        <TextInput
          label="What's your dream?"
          placeholder="Visit Japan 🇯🇵"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            variant="ghost"
            onPress={closeSheet}
            style={{ flex: 1 }}
          />
          <Button
            title="Add to Board"
            onPress={handleAddVision}
            loading={addVision.isPending}
            style={{ flex: 1 }}
          />
        </View>
      </GorhomBottomSheet>

      <GorhomBottomSheet
        ref={deleteSheetRef}
        title="Remove Dream? 🗑️"
        snapPoints={["30%"]}
        onClose={() => setVisionToDelete(null)}
      >
        <Typography
          variant="body"
          style={{
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          Are you sure you want to remove "{visionToDelete?.title}"?
        </Typography>
        <View style={styles.modalButtons}>
          <Button
            title="Cancel"
            variant="ghost"
            onPress={() => deleteSheetRef.current?.close()}
            style={{ flex: 1 }}
          />
          <Button
            title="Remove"
            variant="danger"
            onPress={confirmDelete}
            loading={deleteVision.isPending}
            style={{ flex: 1 }}
          />
        </View>
      </GorhomBottomSheet>
    </View>
  );
};

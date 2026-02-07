import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";
import { Button } from "@design-system/Button";
import { GlassCard } from "@design-system/GlassCard";
import { TextInput } from "@design-system/TextInput";
import { Ionicons } from "@expo/vector-icons";
import {
  GorhomBottomSheet,
  GorhomBottomSheetRef,
} from "@design-system/GorhomBottomSheet";
import { GlassDatePicker } from "@components/Tasks/ui/GlassDatePicker";
import {
  useAddTimeCapsule,
  useTimeCapsules,
  CapsuleMood,
} from "@controllers/timeCapsule.controller";

const MOODS: {
  id: CapsuleMood;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    id: "motivation",
    label: "Motivation",
    icon: "flame-outline",
    color: "#F59E0B",
  },
  {
    id: "reflection",
    label: "Reflection",
    icon: "bulb-outline",
    color: "#3B82F6",
  },
  { id: "random", label: "Random", icon: "dice-outline", color: "#10B981" },
  {
    id: "celebration",
    label: "Celebration",
    icon: "gift-outline",
    color: "#EC4899",
  },
];

export const FutureSelfNoteConfig = () => {
  const theme = useTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<GorhomBottomSheetRef>(null);

  const addCapsule = useAddTimeCapsule();
  const { data: capsules = [] } = useTimeCapsules();

  const [note, setNote] = useState("");
  const [unlockDate, setUnlockDate] = useState(new Date(Date.now() + 86400000)); // +1 day default
  const [selectedMood, setSelectedMood] = useState<CapsuleMood>("motivation");

  const openSheet = () => bottomSheetRef.current?.open();
  const closeSheet = () => bottomSheetRef.current?.close();

  const handleLock = () => {
    if (!note.trim()) return;

    addCapsule.mutate(
      {
        message: note.trim(),
        unlockDate: unlockDate.toISOString(),
        mood: selectedMood,
      },
      {
        onSuccess: () => {
          closeSheet();
          setNote("");
          setUnlockDate(new Date(Date.now() + 86400000));
          setSelectedMood("motivation");
        },
      },
    );
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    gradient: {
      padding: theme.spacing.xs,
      alignItems: "flex-start",
    },
    formContainer: {
      gap: theme.spacing.lg,
    },
    messageInput: {
      height: 120,
      textAlignVertical: "top",
    },
    sectionLabel: {
      color: theme.colors.textMuted,
      marginBottom: 8,
      fontSize: 14,
      fontWeight: "500",
    },
    moodRow: {
      flexDirection: "row",
      gap: 8, // Tighter gap
      flexWrap: "wrap",
      // justifyContent: "center", // CSS Revert: Align Left
    },
    moodChip: {
      paddingVertical: 8,
      paddingHorizontal: 12, // Compact padding
      borderRadius: 24,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    moodChipSelected: {
      // Handled inline for dynamic color
    },
    moodText: {
      color: theme.colors.textMuted,
      fontWeight: "500",
      fontSize: 13, // Slightly smaller to help fit 3
    },
    moodTextSelected: {
      color: "#fff",
      fontWeight: "600",
    },
    modalButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xl, // Added spacing from bottom
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },
  });

  const MAX_MESSAGE_LENGTH = 300;

  return (
    <View>
      <GlassCard variant="featured">
        <View style={{ padding: theme.spacing.md }}>
          {/* Standard Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <Ionicons name="time-outline" size={20} color={theme.colors.text} />
            <Typography
              variant="h3"
              style={{
                color: theme.colors.text,
                fontWeight: "700",
                fontSize: theme.fontSize.lg,
              }}
            >
              Time Capsule
            </Typography>
          </View>

          {/* Content */}
          <Typography
            style={{
              color: "rgba(255,255,255,0.6)",
              marginBottom: 16,
              fontSize: theme.fontSize.sm,
              lineHeight: 20,
            }}
          >
            {capsules.length > 0
              ? `${capsules.length} capsule${capsules.length !== 1 ? "s" : ""} stored. Who knows what they say?`
              : "Send a message to the future. Unlock it when the time is right."}
          </Typography>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Button
              title="Write Note"
              icon={<Ionicons name="pencil" size={16} color="#FFF" />}
              variant="primary"
              onPress={openSheet}
              style={{ flex: 1 }}
            />
            {capsules.length > 0 && (
              <Button
                title="View Vault"
                icon={<Ionicons name="lock-closed" size={16} color="#FFF" />}
                variant="glass"
                onPress={() => router.push("/time-capsule/vault")}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>
      </GlassCard>

      {/* Creation Sheet */}
      <GorhomBottomSheet
        ref={bottomSheetRef}
        snapPoints={["85%"]}
        enableScroll
        onClose={() => setNote("")}
      >
        <View style={styles.formContainer}>
          {/* Custom Header */}
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <Typography variant="h3" style={{ fontWeight: "700" }}>
              Write to Future Self
            </Typography>
            <Typography
              style={{
                color: theme.colors.textMuted,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Seal a message for your future milestones.
            </Typography>
          </View>

          <View>
            <TextInput
              label="Your Message"
              placeholder="I hope you have achieved..."
              multiline
              numberOfLines={4}
              style={styles.messageInput}
              value={note}
              onChangeText={setNote}
              maxLength={MAX_MESSAGE_LENGTH}
            />
            <Typography
              style={{
                alignSelf: "flex-end",
                fontSize: 11,
                color:
                  note.length >= MAX_MESSAGE_LENGTH
                    ? "#EF4444"
                    : "rgba(255,255,255,0.4)",
                marginTop: 4,
              }}
            >
              {note.length} / {MAX_MESSAGE_LENGTH} characters
            </Typography>
          </View>

          {/* Date & Time Row */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Unlock Date"
                value={unlockDate}
                onChange={setUnlockDate}
                mode="date"
                minimumDate={new Date()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Unlock Time"
                value={unlockDate}
                onChange={(date) => {
                  // Merge proper date parts if needed, but standard picker handles datetime obj
                  setUnlockDate(date);
                }}
                mode="time"
                minimumDate={new Date()}
              />
            </View>
          </View>

          <View>
            <Typography style={styles.sectionLabel}>Select Mood</Typography>
            <View style={styles.moodRow}>
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                // Unified Blue Selection
                const activeColor = "#3B82F6";

                return (
                  <TouchableOpacity
                    key={mood.id}
                    activeOpacity={0.7}
                    style={[
                      styles.moodChip,
                      isSelected && {
                        borderColor: activeColor,
                        borderWidth: 1.5, // Thicker border for active
                        backgroundColor: "rgba(59, 130, 246, 0.2)", // Richer Blue Tint
                        // Glow Effect
                        shadowColor: activeColor,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 10,
                        elevation: 4, // Android Glow
                      },
                    ]}
                    onPress={() => setSelectedMood(mood.id)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name={mood.icon}
                        size={18}
                        color={isSelected ? "#FFF" : theme.colors.textMuted}
                      />
                      <Typography
                        style={[
                          styles.moodText,
                          isSelected && {
                            color: "#FFF", // White text when selected
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {mood.label}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              variant="outline" // Now Glassy Outline
              onPress={closeSheet}
              style={{ flex: 1 }}
            />
            <Button
              title="Seal Capsule"
              icon={<Ionicons name="lock-closed" size={16} color="#FFF" />} // Added Icon
              onPress={handleLock}
              loading={addCapsule.isPending}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </GorhomBottomSheet>
    </View>
  );
};

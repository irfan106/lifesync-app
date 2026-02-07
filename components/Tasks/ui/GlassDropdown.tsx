import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
  GorhomBottomSheet,
  GorhomBottomSheetRef,
} from "@design-system/GorhomBottomSheet";

interface Option {
  label: string;
  value: string;
  icon?: string;
  color?: string;
}

interface GlassDropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
}) => {
  const theme = useTheme();
  const bottomSheetRef = useRef<GorhomBottomSheetRef>(null);
  const selectedOption = options.find((o) => o.value === value);

  const openSheet = () => bottomSheetRef.current?.open();
  const closeSheet = () => bottomSheetRef.current?.close();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontSize: 14,
      fontWeight: "500",
    },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    valueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    text: {
      color: value ? "#fff" : "rgba(255, 255, 255, 0.4)",
      fontSize: 15,
    },
    optionsContainer: {
      paddingBottom: 24,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    optionSelected: {
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      borderColor: "rgba(139, 92, 246, 0.5)",
      borderWidth: 1,
    },
    optionText: {
      color: "#fff",
      fontSize: 16,
      marginLeft: 12,
    },
    icon: {
      fontSize: 20,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Typography style={styles.label}>{label}</Typography>}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openSheet}
        style={styles.trigger}
      >
        <View style={styles.valueRow}>
          {selectedOption?.icon && (
            <Typography style={styles.icon}>{selectedOption.icon}</Typography>
          )}
          <Typography style={styles.text}>
            {selectedOption?.label || placeholder}
          </Typography>
        </View>
        <Ionicons name="chevron-down" size={18} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>

      <GorhomBottomSheet
        ref={bottomSheetRef}
        title={label || "Select Option"}
        snapPoints={["50%"]}
        enableScroll
      >
        <ScrollView
          style={styles.optionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.option,
                value === opt.value && styles.optionSelected,
              ]}
              onPress={() => {
                onChange(opt.value);
                closeSheet();
              }}
            >
              {opt.icon && (
                <Typography style={styles.icon}>{opt.icon}</Typography>
              )}
              <Typography
                style={[
                  styles.optionText,
                  { fontWeight: value === opt.value ? "700" : "400" },
                ]}
              >
                {opt.label}
              </Typography>
              {value === opt.value && (
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Ionicons name="checkmark" size={20} color="#8B5CF6" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </GorhomBottomSheet>
    </View>
  );
};

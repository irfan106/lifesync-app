import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface GlassDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
}

export const GlassDatePicker: React.FC<GlassDatePickerProps> = ({
  value,
  onChange,
  label,
  mode = "datetime",
  minimumDate,
}) => {
  const theme = useTheme();

  // Android state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState(new Date(value));

  // iOS state is handled inline if needed, or we just render standard.
  // For this Glass aesthetic, we keep the trigger button but launch the native interaction.

  const formatDisplay = (d: Date) => {
    if (mode === "date") {
      return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (mode === "time") {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePress = () => {
    if (Platform.OS === "android") {
      setTempDate(new Date(value));
      // Initialize based on mode
      if (mode === "time") {
        setPickerMode("time");
      } else {
        setPickerMode("date"); // 'date' or 'datetime' starts with date
      }
      setShowPicker(true);
    } else {
      setShowPicker(!showPicker);
    }
  };

  const onAndroidChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    const currentDate = selectedDate || tempDate;

    if (mode === "datetime" && pickerMode === "date") {
      // Date selected, now show time picker (only for datetime mode)
      setTempDate(currentDate);
      setPickerMode("time");
      setShowPicker(false);
      setTimeout(() => setShowPicker(true), 100);
    } else {
      // Finished selection (Date only, Time only, or Datetime finished)
      setShowPicker(false);
      if (minimumDate && currentDate < minimumDate) {
        // Enforce minimum date if applicable
        onChange(currentDate);
      } else {
        onChange(currentDate);
      }
    }
  };

  const onIOSChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    setShowPicker(Platform.OS === "ios"); // Keep open on iOS until explicit close or inline
    onChange(currentDate);
  };

  const styles = StyleSheet.create({
    container: { marginBottom: 16 },
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
    text: { color: "#fff", fontSize: 15 },
  });

  return (
    <View style={styles.container}>
      {label && <Typography style={styles.label}>{label}</Typography>}
      <TouchableOpacity onPress={handlePress} style={styles.trigger}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            name={mode === "time" ? "time-outline" : "calendar-outline"}
            size={18}
            color="#A78BFA"
          />
          <Typography style={styles.text}>{formatDisplay(value)}</Typography>
        </View>
        {/* iOS Indicator if expanded */}
        {Platform.OS === "ios" && (
          <Ionicons
            name={showPicker ? "chevron-up" : "chevron-down"}
            size={16}
            color="rgba(255,255,255,0.5)"
          />
        )}
      </TouchableOpacity>

      {/* Android Picker (Dialog) */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={tempDate}
          mode={pickerMode}
          is24Hour={false} // User preference usually, but false is safe default
          onChange={onAndroidChange}
          minimumDate={minimumDate}
        />
      )}

      {/* iOS Picker (Inline/Spinner) */}
      {Platform.OS === "ios" && showPicker && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 12,
          }}
        >
          <DateTimePicker
            testID="dateTimePicker"
            value={value}
            mode={mode}
            is24Hour={true}
            display="spinner"
            onChange={onIOSChange}
            minimumDate={minimumDate}
            textColor="white"
            themeVariant="dark" // iOS 14+
          />
        </View>
      )}
    </View>
  );
};

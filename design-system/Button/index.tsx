import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  View,
  Text,
  TextStyle,
} from "react-native";
import { useTheme } from "@context/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "glass" | "outline" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string | React.ReactNode;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  icon,
  textStyle,
}) => {
  const theme = useTheme();

  // Shared geometric properties
  const BUTTON_HEIGHT = 50;
  const BORDER_RADIUS = 16;
  const ICON_SIZE = 18;

  const styles = StyleSheet.create({
    container: {
      height: BUTTON_HEIGHT,
      borderRadius: BORDER_RADIUS,
      overflow: "visible", // Allowed for shadows
      justifyContent: "center",
    },
    touchable: {
      flex: 1,
      borderRadius: BORDER_RADIUS,
      overflow: "hidden", // Clips internal content like gradients/blur
    },
    contentFunc: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    // --- Variants ---

    // Primary - Glass (Look-alike)
    primaryContainer: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderTopColor: "rgba(255, 255, 255, 0.4)",
      borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    primaryShadow: {
      // Removed purple shadow
    },

    // Glass - Liquid Clear
    glassBorder: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderTopColor: "rgba(255, 255, 255, 0.4)",
      borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    glassBg: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.08)", // Slightly more visible
    },

    // Outline (Glassy but Clear)
    outlineBorder: {
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderTopColor: "rgba(255, 255, 255, 0.5)", // Stronger Highlight
      backgroundColor: "transparent", // No Fill for contrast
    },

    // Danger
    dangerBorder: {
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.3)",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },

    // Disabled
    disabledOpacity: {
      opacity: 0.5,
    },

    // Texts
    label: {
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
    textPrimary: {
      color: "#FFF",
      textShadowColor: "rgba(0,0,0,0.2)",
      textShadowRadius: 4,
    },
    textGlass: {
      color: "#FFF",
      textShadowColor: "rgba(0,0,0,0.1)",
      textShadowRadius: 2,
    },
    textOutline: { color: "#FFF" }, // White text for outline
    textDanger: { color: "#F87171" },
    textGhost: { color: theme.colors.textSecondary },

    iconText: {
      fontSize: ICON_SIZE,
    },
  });

  const getVariantContent = () => {
    switch (variant) {
      case "primary":
        // Inherit Glass Bg
        return (
          <View style={styles.glassBg}>
            <View style={styles.contentFunc}>{renderInner()}</View>
          </View>
        );

      case "glass":
        return (
          <View style={styles.glassBg}>
            <View style={styles.contentFunc}>{renderInner()}</View>
          </View>
        );

      case "outline":
      case "ghost":
      case "danger":
        return <View style={styles.contentFunc}>{renderInner()}</View>;
    }
  };

  const renderInner = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? "#FFF" : "#FFF"} // White spinner
        />
      );
    }

    // Explicitly define type to avoid union mismatches
    let activeTextStyle: TextStyle = styles.textPrimary;
    if (variant === "glass") activeTextStyle = styles.textGlass;
    if (variant === "outline") activeTextStyle = styles.textOutline;
    if (variant === "ghost") activeTextStyle = styles.textGhost;
    if (variant === "danger") activeTextStyle = styles.textDanger;

    return (
      <>
        {icon && <Text style={styles.iconText}>{icon}</Text>}
        <Text style={[styles.label, activeTextStyle, textStyle]}>{title}</Text>
      </>
    );
  };

  // Outer container style adjustments
  const containerStyles: any[] = [
    styles.container,
    style,
    disabled && styles.disabledOpacity,
    variant === "primary" && [styles.primaryContainer, styles.primaryShadow],
    variant === "glass" && styles.glassBorder,
    variant === "outline" && styles.outlineBorder,
    variant === "danger" && styles.dangerBorder,
  ];

  return (
    <View style={containerStyles}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={disabled || loading}
        style={styles.touchable}
      >
        {getVariantContent()}
      </TouchableOpacity>
    </View>
  );
};

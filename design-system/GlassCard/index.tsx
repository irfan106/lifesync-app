import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "@context/ThemeContext";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "featured" | "dark";
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = "default",
  noPadding = false,
}) => {
  const theme = useTheme();

  const getVariantStyles = () => {
    // Shared neutral glass style matched to Button component
    const neutralGlass = {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderTopColor: "rgba(255, 255, 255, 0.4)",
    };

    switch (variant) {
      case "featured":
        return neutralGlass; // No more purple, just glass
      case "dark":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderTopColor: "rgba(255, 255, 255, 0.2)",
        };
      default:
        return neutralGlass;
    }
  };

  const variantStyle = getVariantStyles();

  const styles = StyleSheet.create({
    container: {
      borderRadius: 24,
      borderWidth: 1,
      overflow: "hidden",
      ...variantStyle,
      ...variantStyle,
    },
    content: {
      padding: noPadding ? 0 : 16,
      flex: 1, // Ensure content fills the card (critical for empty states)
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

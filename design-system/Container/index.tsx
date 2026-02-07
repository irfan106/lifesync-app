import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@context/ThemeContext";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  centered?: boolean;
  padding?: boolean;
  safeArea?: boolean;
  glass?: boolean; // New prop for glassmorphic surfaces
  transparent?: boolean; // Use when inside GlassBackground
}

export const Container: React.FC<ContainerProps> = ({
  children,
  centered,
  padding = true,
  safeArea = true,
  glass = false,
  transparent = false,
  style,
  ...props
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: transparent
        ? "transparent"
        : glass
          ? theme.colors.surface
          : theme.colors.background,
    },
    safeArea: {
      paddingTop: insets.top,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    padding: {
      padding: theme.spacing.md,
    },
    glass: {
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <View
      style={[
        styles.container,
        safeArea && styles.safeArea,
        centered && styles.centered,
        padding && styles.padding,
        glass && styles.glass,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

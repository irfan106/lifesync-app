import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";

export interface GorhomBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface GorhomBottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  enableScroll?: boolean;
  onClose?: () => void;
  visible?: boolean;
}

const GlassSheetBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  return (
    <LinearGradient
      colors={["rgba(30, 30, 40, 0.95)", "rgba(10, 10, 15, 0.98)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        style,
        {
          borderRadius: 28,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderTopColor: "rgba(255, 255, 255, 0.3)", // Glass Highlight
          overflow: "hidden",
        },
      ]}
    />
  );
};

export const GorhomBottomSheet = forwardRef<
  GorhomBottomSheetRef,
  GorhomBottomSheetProps
>(
  (
    {
      title,
      children,
      snapPoints: customSnapPoints,
      enableScroll = false,
      onClose,
      visible,
    },
    ref,
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(
      () => customSnapPoints || ["50%", "85%"],
      [customSnapPoints],
    );

    // Handle visible prop changes
    useEffect(() => {
      if (visible !== undefined) {
        if (visible) {
          bottomSheetRef.current?.present();
        } else {
          bottomSheetRef.current?.dismiss();
        }
      }
    }, [visible]);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.present();
      },
      close: () => {
        bottomSheetRef.current?.dismiss();
      },
    }));

    const handleDismiss = useCallback(() => {
      Keyboard.dismiss();
      onClose?.();
    }, [onClose]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.8} // Darker backdrop for better contrast
        />
      ),
      [],
    );

    const ContentWrapper = enableScroll
      ? BottomSheetScrollView
      : BottomSheetView;

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={snapPoints.length - 1}
        snapPoints={snapPoints}
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        backgroundComponent={GlassSheetBackground} // Use Custom Glass BG
        enablePanDownToClose
        handleIndicatorStyle={styles.handle}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <ContentWrapper
          style={[
            styles.contentContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          {title && (
            <View style={styles.header}>
              <Typography style={[styles.title, { color: theme.colors.text }]}>
                {title}
              </Typography>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </ContentWrapper>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  // Background handled by component now
  handle: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: 40,
    height: 4,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    // Dynamic height based on children
  },
});

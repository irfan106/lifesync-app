import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const GlassBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../../assets/bg_image.webp")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(13, 13, 26, 0.2)",
            "rgba(13, 13, 26, 0.5)",
            "rgba(13, 13, 26, 0.75)",
          ]}
          locations={[0, 0.5, 1]}
          style={styles.overlay}
        />
      </ImageBackground>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});

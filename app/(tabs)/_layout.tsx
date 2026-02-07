import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@context/ThemeContext";
import { Typography } from "@design-system/Typography";

export default function TabsLayout() {
  const theme = useTheme();

  const TabIcon = ({
    name,
    focused,
    iconName,
  }: {
    name: string;
    focused: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
  }) => (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 60,
      }}
    >
      {/* Active Indicator Glow */}
      {focused && (
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.05)"]}
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#FFFFFF", // White dot
              position: "absolute",
              bottom: 4,
            }}
          />
        </LinearGradient>
      )}

      <Ionicons
        name={focused ? iconName : (`${iconName}-outline` as any)}
        size={24}
        color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)"}
        style={{
          shadowColor: focused ? "#FFFFFF" : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: focused ? 0.3 : 0,
          shadowRadius: 8,
        }}
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          borderRadius: 32,
          height: 64,
          backgroundColor: "rgba(255, 255, 255, 0.08)", // Glass Background
          borderTopWidth: 1,
          elevation: 0,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)", // Glass Border
          borderTopColor: "rgba(255, 255, 255, 0.4)", // Glass Highlight
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          flex: 1,
          justifyContent: "center",
          marginTop: 0,
          marginBottom: 0,
        },
        // Removed custom background to let backgroundColor handle the glass tint
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Home" focused={focused} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Tasks" focused={focused} iconName="checkbox" />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Wallet" focused={focused} iconName="wallet" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Settings" focused={focused} iconName="settings" />
          ),
        }}
      />
    </Tabs>
  );
}

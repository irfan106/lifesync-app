import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import { Typography } from "@design-system/Typography";
import { Button } from "@design-system/Button";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
      Toast.show({ type: "success", text1: "Signed out successfully" });
    } catch (error: any) {
      Toast.show({ type: "error", text1: "Failed to sign out" });
    }
  };

  const styles = StyleSheet.create({
    content: {
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
    },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.text,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 13,
    },
    profileCard: {
      borderRadius: 24,
      marginBottom: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      padding: 24,
      alignItems: "center",
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(139, 92, 246, 0.3)",
      borderWidth: 2,
      borderColor: "#8B5CF6",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: "800",
      color: "#fff",
    },
    userName: {
      fontSize: 22,
      color: theme.colors.text,
      fontWeight: "800",
    },
    userEmail: {
      fontSize: 13,
      color: theme.colors.textMuted,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
      marginTop: 8,
    },
    settingsCard: {
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      overflow: "hidden",
    },
    settingsItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.05)",
    },
    settingsItemLast: {
      borderBottomWidth: 0,
    },
    settingsIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingsLabel: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: "500",
    },
    settingsValue: {
      fontSize: 13,
      color: theme.colors.textMuted,
      marginRight: 8,
    },
    dangerCard: {
      borderRadius: 20,
      marginBottom: 20,
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(239, 68, 68, 0.2)",
      overflow: "hidden",
    },
    version: {
      textAlign: "center",
      color: theme.colors.textMuted,
      fontSize: 12,
      marginTop: 24,
    },
  });

  const SettingsItem: React.FC<SettingsItemProps> = ({
    icon,
    iconColor = theme.colors.primary,
    label,
    value,
    onPress,
    showArrow = true,
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsIconContainer}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Typography style={styles.settingsLabel}>{label}</Typography>
      {value && <Typography style={styles.settingsValue}>{value}</Typography>}
      {showArrow && onPress && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textMuted}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <GlassBackground>
      <Container safeArea transparent>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="settings-outline"
                size={22}
                color={theme.colors.text}
              />
            </View>
            <View>
              <Typography style={styles.title}>Settings</Typography>
              <Typography style={styles.subtitle}>
                Manage your account
              </Typography>
            </View>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Typography style={styles.avatarText}>{initials}</Typography>
            </View>
            <Typography style={styles.userName}>{displayName}</Typography>
            <Typography style={styles.userEmail}>
              {user?.email || "No email"}
            </Typography>
          </View>

          {/* Account Section */}
          <Typography style={styles.sectionTitle}>Account</Typography>
          <View style={styles.settingsCard}>
            <SettingsItem
              icon="mail-outline"
              label="Email"
              value={user?.email || "-"}
              showArrow={false}
            />
            <SettingsItem
              icon="finger-print-outline"
              label="Account ID"
              value={`${user?.uid?.slice(0, 8)}...`}
              showArrow={false}
            />
            <View style={styles.settingsItemLast}>
              <SettingsItem
                icon="shield-checkmark-outline"
                iconColor="#10B981"
                label="Account Status"
                value="Active"
                showArrow={false}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <Typography style={styles.sectionTitle}>Preferences</Typography>
          <View style={styles.settingsCard}>
            <SettingsItem
              icon="notifications-outline"
              label="Notifications"
              value="On"
            />
            <SettingsItem
              icon="moon-outline"
              label="Dark Mode"
              value="Always"
            />
            <View style={styles.settingsItemLast}>
              <SettingsItem
                icon="language-outline"
                label="Language"
                value="English"
              />
            </View>
          </View>

          {/* About Section */}
          <Typography style={styles.sectionTitle}>About</Typography>
          <View style={styles.settingsCard}>
            <SettingsItem
              icon="information-circle-outline"
              label="App Version"
              value="1.0.0"
              showArrow={false}
            />
            <SettingsItem icon="document-text-outline" label="Privacy Policy" />
            <View style={styles.settingsItemLast}>
              <SettingsItem icon="help-circle-outline" label="Help & Support" />
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.dangerCard}>
            <TouchableOpacity
              style={[styles.settingsItem, styles.settingsItemLast]}
              onPress={handleSignOut}
            >
              <View
                style={[
                  styles.settingsIconContainer,
                  { backgroundColor: "rgba(239, 68, 68, 0.2)" },
                ]}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              </View>
              <Typography style={[styles.settingsLabel, { color: "#EF4444" }]}>
                Sign Out
              </Typography>
              <Ionicons name="chevron-forward" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <Typography style={styles.version}>
            Made with 💜 • LifeSync v1.0.0
          </Typography>
        </ScrollView>
      </Container>
    </GlassBackground>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@services/firebaseConfig";
import { GlassBackground } from "@design-system/GlassBackground";
import { Container } from "@design-system/Container";
import { Typography } from "@design-system/Typography";
import { TextInput } from "@design-system/TextInput";
import { Button } from "@design-system/Button";
import { useTheme } from "@context/ThemeContext";
import { useAuth } from "@context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const SignUpSchema = Yup.object().shape({
  name: Yup.string().min(2, "Min 2 characters").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function LoginScreen() {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "557833679414-mf70gou2g6uvbdvorosbiti6ml8i2iug.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setGoogleLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .catch((error) => console.error(error))
        .finally(() => setGoogleLoading(false));
    }
  }, [response]);

  const styles = StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingVertical: isSignUp ? 20 : 40,
    },
    header: {
      alignItems: "center",
      marginBottom: isSignUp ? 24 : 40,
    },
    logoContainer: {
      width: isSignUp ? 70 : 90,
      height: isSignUp ? 70 : 90,
      borderRadius: isSignUp ? 20 : 28,
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      borderWidth: 1,
      borderColor: "rgba(139, 92, 246, 0.4)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isSignUp ? 12 : 20,
    },
    appName: {
      fontSize: isSignUp ? 26 : 32,
      fontWeight: "800",
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    tagline: {
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontSize: theme.fontSize.sm,
    },
    features: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginTop: 16,
    },
    featurePill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    featureText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    formCard: {
      borderRadius: 24,
      marginBottom: 24,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      padding: 24,
    },
    formHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginBottom: 24,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
    },
    form: {
      gap: 16,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    dividerText: {
      marginHorizontal: 16,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.sm,
    },
    googleButton: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    googleButtonText: {
      color: theme.colors.text,
      fontWeight: "600",
      fontSize: 15,
    },
    switchText: {
      textAlign: "center",
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
    },
    switchLink: {
      color: theme.colors.secondary,
      fontWeight: "700",
    },
  });

  const handleSubmit = async (values: {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(values.email, values.password, values.name);
      } else {
        await signIn(values.email, values.password);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassBackground>
      <Container safeArea transparent>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons
                  name="pulse-outline"
                  size={isSignUp ? 36 : 44}
                  color="#8B5CF6"
                />
              </View>
              <Typography style={styles.appName}>LifeSync</Typography>
              {!isSignUp && (
                <>
                  <Typography style={styles.tagline}>
                    Your daily life companion
                  </Typography>
                  <View style={styles.features}>
                    <View style={styles.featurePill}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={14}
                        color={theme.colors.secondary}
                      />
                      <Typography style={styles.featureText}>Tasks</Typography>
                    </View>
                    <View style={styles.featurePill}>
                      <Ionicons
                        name="wallet-outline"
                        size={14}
                        color={theme.colors.secondary}
                      />
                      <Typography style={styles.featureText}>
                        Expenses
                      </Typography>
                    </View>
                    <View style={styles.featurePill}>
                      <Ionicons
                        name="analytics-outline"
                        size={14}
                        color={theme.colors.secondary}
                      />
                      <Typography style={styles.featureText}>
                        Analytics
                      </Typography>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Ionicons
                  name={isSignUp ? "person-add-outline" : "log-in-outline"}
                  size={22}
                  color={theme.colors.primary}
                />
                <Typography style={styles.formTitle}>
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </Typography>
              </View>

              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={isSignUp ? SignUpSchema : LoginSchema}
                onSubmit={handleSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View style={styles.form}>
                    {isSignUp && (
                      <TextInput
                        label="Full Name"
                        placeholder="John Doe"
                        autoCapitalize="words"
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        error={
                          touched.name && errors.name ? errors.name : undefined
                        }
                      />
                    )}
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      error={
                        touched.email && errors.email ? errors.email : undefined
                      }
                    />
                    <TextInput
                      label="Password"
                      placeholder="••••••••"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      error={
                        touched.password && errors.password
                          ? errors.password
                          : undefined
                      }
                    />
                    {isSignUp && (
                      <TextInput
                        label="Confirm Password"
                        placeholder="••••••••"
                        secureTextEntry
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                        error={
                          touched.confirmPassword && errors.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                        }
                      />
                    )}
                    <Button
                      title={
                        loading
                          ? "Please wait..."
                          : isSignUp
                            ? "Create Account"
                            : "Sign In"
                      }
                      onPress={() => handleSubmit()}
                      loading={loading}
                      disabled={loading}
                      icon={
                        <Ionicons
                          name={
                            isSignUp ? "person-add-outline" : "log-in-outline"
                          }
                          size={18}
                          color="#fff"
                        />
                      }
                    />
                  </View>
                )}
              </Formik>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Typography style={styles.dividerText}>
                  or continue with
                </Typography>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.googleButton}
                onPress={() => promptAsync()}
                disabled={!request || googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator color={theme.colors.text} />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#fff" />
                )}
                <Typography style={styles.googleButtonText}>
                  Continue with Google
                </Typography>
              </TouchableOpacity>
            </View>

            {/* Switch Auth Mode */}
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Typography style={styles.switchText}>
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <Typography style={styles.switchLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Typography>
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </GlassBackground>
  );
}

import { useState } from "react";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import {
  WalletHeader,
  ExpenseList,
  ExpenseBottomSheet,
  SpendingSummary,
} from "@components/Wallet";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { IExpense } from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function WalletScreen() {
  const theme = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<IExpense | null>(null);

  const handleEditExpense = (expense: IExpense) => {
    setEditingExpense(expense);
    setSheetVisible(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setSheetVisible(true);
  };

  const styles = StyleSheet.create({
    content: {
      gap: theme.spacing.lg,
      paddingBottom: 100,
    },
    fab: {
      position: "absolute",
      bottom: 110,
      right: 20,
      borderRadius: 30,
      // Glass border highlights
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderTopColor: "rgba(255, 255, 255, 0.45)",
      borderLeftColor: "rgba(255, 255, 255, 0.25)",
      overflow: "hidden",
      // Glass shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    fabGlass: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <GlassBackground>
      <Container safeArea transparent>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <WalletHeader />
          <SpendingSummary />
          <ExpenseList onEditExpense={handleEditExpense} />
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.7}
          onPress={handleAddExpense}
        >
          <View style={styles.fabGlass}>
            <Ionicons name="add" size={32} color={theme.colors.text} />
          </View>
        </TouchableOpacity>

        {/* Expense BottomSheet for Add/Edit/Delete */}
        <ExpenseBottomSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          expense={editingExpense}
        />
      </Container>
    </GlassBackground>
  );
}

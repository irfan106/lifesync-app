import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import { GlassDatePicker } from "@components/Tasks/ui";
import {
  GorhomBottomSheet,
  GorhomBottomSheetRef,
} from "@design-system/GorhomBottomSheet";
import { TextInput } from "@design-system/TextInput";
import { Button } from "@design-system/Button";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import {
  useAddExpense,
  useUpdateExpense,
  useDeleteExpense,
} from "@controllers/expense.controller";
import {
  IExpense,
  EXPENSE_CATEGORIES,
  ExpenseCategory,
} from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";

interface ExpenseBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  expense?: IExpense | null;
}

export const ExpenseBottomSheet: React.FC<ExpenseBottomSheetProps> = ({
  visible,
  onClose,
  expense,
}) => {
  const theme = useTheme();
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const deleteSheetRef = useRef<GorhomBottomSheetRef>(null);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("other");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (visible) {
      if (expense) {
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setNote(expense.note || "");
        setDate(new Date(expense.date));
      } else {
        setAmount("");
        setCategory("other");
        setNote("");
        setDate(new Date());
      }
    }
  }, [visible, expense]);

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid expense amount.");
      return;
    }

    if (!category) {
      Alert.alert("Missing Category", "Please select a category.");
      return;
    }

    const payload = {
      amount: parsedAmount,
      category,
      note: note.trim() || undefined,
      date: date.toISOString(),
    };

    if (expense) {
      updateExpense.mutate(
        { expenseId: expense.id, updates: payload },
        { onSuccess: () => onClose() },
      );
    } else {
      addExpense.mutate(payload, { onSuccess: () => onClose() });
    }
  };

  const handleDelete = () => {
    if (!expense) return;
    deleteSheetRef.current?.open();
  };

  const confirmDelete = () => {
    if (expense) {
      deleteExpense.mutate(expense.id, {
        onSuccess: () => {
          deleteSheetRef.current?.close();
          onClose();
        },
      });
    }
  };

  const isEditing = !!expense;
  const isLoading =
    addExpense.isPending || updateExpense.isPending || deleteExpense.isPending;

  const styles = StyleSheet.create({
    header: {
      alignItems: "center",
      marginBottom: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerTitle: {
      fontWeight: "800",
      fontSize: 22,
      color: theme.colors.text,
    },
    headerSubtitle: {
      color: theme.colors.textMuted,
      fontSize: 13,
      marginTop: 4,
    },
    form: {
      gap: 20,
      paddingBottom: 40,
    },
    amountContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
    },
    amountInputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      paddingHorizontal: 16,
      paddingVertical: 4,
      gap: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    sectionLabel: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
    },
    categoryRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    activeChip: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderColor: theme.colors.primary,
    },
    chipText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    activeChipText: {
      color: "#fff",
      fontWeight: "700",
    },
    actions: {
      flexDirection: "row",
      marginTop: 24,
      gap: 12,
      marginBottom: 30,
    },
  });

  return (
    <>
      <GorhomBottomSheet
        visible={visible}
        onClose={onClose}
        snapPoints={["85%"]}
        enableScroll
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons
              name={isEditing ? "create-outline" : "wallet-outline"}
              size={24}
              color={theme.colors.text}
            />
            <Typography style={styles.headerTitle}>
              {isEditing ? "Edit Expense" : "Add Expense"}
            </Typography>
          </View>
          <Typography style={styles.headerSubtitle}>
            {isEditing ? "Modify your expense details" : "Track your spending"}
          </Typography>
        </View>

        <View style={styles.form}>
          {/* Amount Input */}
          <View>
            <Typography style={styles.sectionLabel}>Amount</Typography>
            <View style={styles.amountInputContainer}>
              <Typography style={styles.currencySymbol}>₹</Typography>
              <RNTextInput
                placeholder="0.00"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                style={styles.amountInput}
              />
            </View>
          </View>

          {/* Category Chips */}
          <View>
            <Typography style={styles.sectionLabel}>Category</Typography>
            <View style={styles.categoryRow}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = category === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    activeOpacity={0.7}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.activeChip,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={16}
                      color={isSelected ? "#fff" : theme.colors.textSecondary}
                    />
                    <Typography
                      style={[
                        styles.chipText,
                        isSelected && styles.activeChipText,
                      ]}
                    >
                      {cat.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Note Input */}
          <TextInput
            label="Note (Optional)"
            placeholder="What was this expense for?"
            value={note}
            onChangeText={setNote}
          />

          {/* Date & Time Pickers */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Date"
                value={date}
                onChange={setDate}
                mode="date"
              />
            </View>
            <View style={{ flex: 1 }}>
              <GlassDatePicker
                label="Time"
                value={date}
                onChange={setDate}
                mode="time"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <Button
              title={isEditing ? "Update" : "Add Expense"}
              onPress={handleSubmit}
              loading={isLoading}
              style={{ flex: 1 }}
              icon={
                <Ionicons
                  name={
                    isEditing
                      ? "checkmark-circle-outline"
                      : "add-circle-outline"
                  }
                  size={18}
                  color="#fff"
                />
              }
            />
          </View>

          {/* Delete Button (Edit Mode Only) */}
          {isEditing && (
            <Button
              title="Delete Expense"
              variant="danger"
              onPress={handleDelete}
              loading={deleteExpense.isPending}
              icon={<Ionicons name="trash-outline" size={18} color="#fff" />}
            />
          )}
        </View>
      </GorhomBottomSheet>

      {/* Delete Confirmation Sheet */}
      <GorhomBottomSheet ref={deleteSheetRef} snapPoints={["35%"]}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Typography
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: theme.colors.text,
              marginTop: 12,
            }}
          >
            Delete Expense?
          </Typography>
          <Typography
            variant="body"
            style={{
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Are you sure you want to delete ₹{expense?.amount}? This cannot be
            undone.
          </Typography>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => deleteSheetRef.current?.close()}
            style={{ flex: 1 }}
          />
          <Button
            title="Delete"
            variant="danger"
            onPress={confirmDelete}
            loading={deleteExpense.isPending}
            style={{ flex: 1 }}
            icon={<Ionicons name="trash-outline" size={18} color="#fff" />}
          />
        </View>
      </GorhomBottomSheet>
    </>
  );
};

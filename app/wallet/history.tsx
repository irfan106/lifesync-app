import React, { useState, useMemo } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import { Container } from "@design-system/Container";
import { GlassBackground } from "@design-system/GlassBackground";
import { Typography } from "@design-system/Typography";
import { useTheme } from "@context/ThemeContext";
import { useExpenses } from "@controllers/expense.controller";
import {
  IExpense,
  EXPENSE_CATEGORIES,
  ExpenseCategory,
} from "@interfaces/expense.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

type DateFilter =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "This Month"
  | "Last 7 Days"
  | "Last 30 Days"
  | "All Time";
type CategoryFilter = "All" | ExpenseCategory;

const DATE_FILTERS: DateFilter[] = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Last 7 Days",
  "Last 30 Days",
  "All Time",
];

export default function ExpenseHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: expenses = [], isLoading } = useExpenses();

  const [dateFilter, setDateFilter] = useState<DateFilter>("All Time");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Logic
  const { filteredExpenses, totalFiltered } = useMemo(() => {
    const filtered = expenses.filter((e: IExpense) => {
      // 1. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const catInfo = EXPENSE_CATEGORIES.find((c) => c.value === e.category);
        const matchesCategory = catInfo?.label.toLowerCase().includes(query);
        const matchesNote = e.note?.toLowerCase().includes(query);
        if (!matchesCategory && !matchesNote) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "All" && e.category !== categoryFilter)
        return false;

      // 3. Date Filter
      if (dateFilter !== "All Time") {
        const expDate = new Date(e.date);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        const expDay = new Date(
          expDate.getFullYear(),
          expDate.getMonth(),
          expDate.getDate(),
        );

        switch (dateFilter) {
          case "Today":
            if (expDay.getTime() !== today.getTime()) return false;
            break;
          case "Yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (expDay.getTime() !== yesterday.getTime()) return false;
            break;
          case "This Week":
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            if (expDay < weekStart || expDay > today) return false;
            break;
          case "This Month":
            if (
              expDate.getMonth() !== now.getMonth() ||
              expDate.getFullYear() !== now.getFullYear()
            )
              return false;
            break;
          case "Last 7 Days":
            const days7Ago = new Date(today);
            days7Ago.setDate(days7Ago.getDate() - 7);
            if (expDay < days7Ago) return false;
            break;
          case "Last 30 Days":
            const days30Ago = new Date(today);
            days30Ago.setDate(days30Ago.getDate() - 30);
            if (expDay < days30Ago) return false;
            break;
        }
      }
      return true;
    });

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    return { filteredExpenses: filtered, totalFiltered: total };
  }, [expenses, dateFilter, categoryFilter, searchQuery]);

  // Group expenses by date
  const sections = useMemo(() => {
    const grouped = filteredExpenses.reduce(
      (acc: Record<string, IExpense[]>, expense) => {
        const dateKey = new Date(expense.date).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(expense);
        return acc;
      },
      {},
    );

    return Object.keys(grouped)
      .map((date) => ({
        title: date,
        data: grouped[date].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
        dayTotal: grouped[date].reduce((sum, e) => sum + e.amount, 0),
      }))
      .sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime(),
      );
  }, [filteredExpenses]);

  const getCategoryInfo = (category: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find((c) => c.value === category);
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      paddingBottom: 8,
      gap: 16,
    },
    searchContainer: {
      marginHorizontal: 16,
      marginBottom: 12,
    },
    searchInput: {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: "#fff",
      fontSize: 14,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    filterContainer: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    filterRow: {
      marginBottom: 12,
    },
    filterLabel: {
      fontSize: 11,
      color: theme.colors.textMuted,
      fontWeight: "600",
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      marginRight: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    activePill: {
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      borderColor: "#8B5CF6",
    },
    pillText: {
      fontSize: 12,
      color: "rgba(255,255,255,0.6)",
      fontWeight: "500",
    },
    activePillText: {
      color: "#fff",
      fontWeight: "700",
    },
    summaryCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden",
    },
    summaryGradient: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    summaryAmount: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.colors.pink,
    },
    summaryCount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: "rgba(0,0,0,0.4)",
      marginTop: 8,
      borderRadius: 8,
      marginHorizontal: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      color: theme.colors.secondary,
      fontWeight: "700",
      textTransform: "uppercase",
      fontSize: 11,
      letterSpacing: 1,
    },
    sectionTotal: {
      fontSize: 12,
      color: theme.colors.pink,
      fontWeight: "700",
    },
    itemContainer: {
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 16,
      overflow: "hidden",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.25)",
      borderLeftColor: "rgba(255, 255, 255, 0.15)",
      borderRadius: 16,
    },
    itemIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemCategory: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    itemNote: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    itemTime: {
      fontSize: 10,
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    itemAmount: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.pink,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 40,
    },
    emptyText: {
      color: theme.colors.textMuted,
      fontSize: 14,
      textAlign: "center",
      marginTop: 16,
    },
  });

  const FilterPill = ({
    label,
    active,
    onPress,
    icon,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
    icon?: string;
  }) => (
    <TouchableOpacity
      style={[styles.pill, active && styles.activePill]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={14}
          color={active ? "#fff" : "rgba(255,255,255,0.6)"}
        />
      )}
      <Typography style={[styles.pillText, active && styles.activePillText]}>
        {label}
      </Typography>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }: { item: IExpense }) => {
    const catInfo = getCategoryInfo(item.category);
    return (
      <View style={styles.itemContainer}>
        <View style={styles.item}>
          <View style={styles.itemIcon}>
            <Ionicons
              name={(catInfo?.icon || "cube-outline") as any}
              size={22}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.itemContent}>
            <Typography style={styles.itemCategory}>
              {catInfo?.label || item.category}
            </Typography>
            {item.note && (
              <Typography style={styles.itemNote} numberOfLines={1}>
                {item.note}
              </Typography>
            )}
            <Typography style={styles.itemTime}>
              {formatTime(item.date)}
            </Typography>
          </View>
          <Typography style={styles.itemAmount}>
            -₹{item.amount.toFixed(2)}
          </Typography>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; dayTotal: number };
  }) => (
    <View style={styles.sectionHeader}>
      <Typography style={styles.sectionTitle}>
        {new Date(section.title).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </Typography>
      <Typography style={styles.sectionTotal}>
        ₹{section.dayTotal.toFixed(2)}
      </Typography>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="wallet-outline"
        size={64}
        color={theme.colors.textMuted}
      />
      <Typography style={styles.emptyText}>
        No expenses found for the selected filters.{"\n"}Try adjusting your
        search or filters.
      </Typography>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GlassBackground>
        <Container safeArea transparent style={{ padding: 0 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color={theme.colors.text}
              />
              <Typography variant="h2" style={{ fontWeight: "800" }}>
                Expense History
              </Typography>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={{ position: "relative" }}>
              <Ionicons
                name="search-outline"
                size={18}
                color={theme.colors.textMuted}
                style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }}
              />
              <RNTextInput
                style={[styles.searchInput, { paddingLeft: 42 }]}
                placeholder="Search by category or note..."
                placeholderTextColor={theme.colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filterContainer}>
            <Typography style={styles.filterLabel}>Date Range</Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
            >
              {DATE_FILTERS.map((filter) => (
                <FilterPill
                  key={filter}
                  label={filter}
                  active={dateFilter === filter}
                  onPress={() => setDateFilter(filter)}
                />
              ))}
            </ScrollView>

            <Typography style={styles.filterLabel}>Category</Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FilterPill
                label="All"
                active={categoryFilter === "All"}
                onPress={() => setCategoryFilter("All")}
              />
              {EXPENSE_CATEGORIES.map((cat) => (
                <FilterPill
                  key={cat.value}
                  label={cat.label}
                  icon={cat.icon}
                  active={categoryFilter === cat.value}
                  onPress={() => setCategoryFilter(cat.value)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryGradient}>
              <View>
                <Typography style={styles.summaryLabel}>
                  Total Filtered
                </Typography>
                <Typography style={styles.summaryAmount}>
                  ₹{totalFiltered.toFixed(2)}
                </Typography>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Typography style={styles.summaryCount}>
                  {filteredExpenses.length} expenses
                </Typography>
              </View>
            </View>
          </View>

          {/* Expense List */}
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Typography style={styles.emptyText}>
                Loading expenses...
              </Typography>
            </View>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderExpenseItem}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </Container>
      </GlassBackground>
    </>
  );
}

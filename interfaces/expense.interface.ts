export type ExpenseCategory = 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment' | 'health' | 'other';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: 'Food', icon: 'fast-food-outline' },
  { value: 'transport', label: 'Transport', icon: 'car-outline' },
  { value: 'shopping', label: 'Shopping', icon: 'cart-outline' },
  { value: 'bills', label: 'Bills', icon: 'document-text-outline' },
  { value: 'entertainment', label: 'Entertainment', icon: 'film-outline' },
  { value: 'health', label: 'Health', icon: 'medical-outline' },
  { value: 'other', label: 'Other', icon: 'cube-outline' },
];

export interface IExpense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string; // ISO String
}

export interface ICreateExpenseDTO {
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string;
}

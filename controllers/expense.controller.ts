import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService, IUpdateExpenseDTO } from '@services/expense.service';
import { ICreateExpenseDTO } from '@interfaces/expense.interface';
import Toast from 'react-native-toast-message';

export const useExpenses = () => {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: () => expenseService.getExpenses(),
    });
};

export const useAddExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: ICreateExpenseDTO) => expenseService.setExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            Toast.show({
                type: 'success',
                text1: 'Expense Added',
                text2: 'Keep tracking every penny! 💰',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Add Expense',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useUpdateExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ expenseId, updates }: { expenseId: string; updates: IUpdateExpenseDTO }) => 
            expenseService.updateExpense(expenseId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            Toast.show({
                type: 'success',
                text1: 'Expense Updated',
                text2: 'Your expense has been updated! ✨',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Update Expense',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (expenseId: string) => expenseService.deleteExpense(expenseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            Toast.show({
                type: 'success',
                text1: 'Expense Deleted',
                text2: 'The expense has been removed! 🗑️',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Delete Expense',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};


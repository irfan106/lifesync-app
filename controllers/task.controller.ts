import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@services/task.service';
import { ICreateTaskDTO, ITask } from '@interfaces/task.interface';
import Toast from 'react-native-toast-message';

export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: () => taskService.getTasks(),
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ICreateTaskDTO) => taskService.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            Toast.show({
                type: 'success',
                text1: 'Task Created',
                text2: 'Your task has been scheduled! 💪',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Create Task',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useToggleTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, currentStatus }: { taskId: string; currentStatus: boolean }) => 
            taskService.toggleTask(taskId, currentStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            Toast.show({
                type: 'success',
                text1: 'Task Updated',
                text2: 'Keep crushing it! 🚀',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Update Task',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, updates }: { taskId: string; updates: any }) => 
            taskService.updateTask(taskId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            Toast.show({
                type: 'success',
                text1: 'Task Updated',
                text2: 'Changes saved successfully! 📝',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Update Task',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => taskService.deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            Toast.show({
                type: 'success',
                text1: 'Task Deleted',
                text2: 'Task removed successfully! 🗑️',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Delete Task',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useAddTask = useCreateTask;

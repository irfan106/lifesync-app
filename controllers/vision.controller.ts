import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visionService } from '@services/vision.service';
import { ICreateVisionDTO } from '@interfaces/vision.interface';
import Toast from 'react-native-toast-message';

export const useVisions = () => {
    return useQuery({
        queryKey: ['visions'],
        queryFn: () => visionService.getVisions(),
    });
};

export const useAddVision = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ICreateVisionDTO) => visionService.addVision(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visions'] });
            Toast.show({
                type: 'success',
                text1: 'Dream Added',
                text2: 'Keep your eyes on the prize! ✨',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Add Dream',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

export const useDeleteVision = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (visionId: string) => visionService.deleteVision(visionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['visions'] });
            Toast.show({
                type: 'info',
                text1: 'Dream Removed',
                text2: 'Updated your vision board',
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to Remove',
                text2: error.message || 'Something went wrong',
            });
        },
    });
};

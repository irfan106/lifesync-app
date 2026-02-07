import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useAuth } from "@context/AuthContext";

export type CapsuleMood = "motivation" | "reflection" | "celebration" | "random";

export interface TimeCapsule {
  id: string;
  userId: string; // Added userId ownership
  message: string;
  createdAt: string; // ISO string
  unlockDate: string; // ISO string
  mood: CapsuleMood;
}

const getStorageKey = (userId: string) => `time_capsules_${userId}`;

// --- API Helpers ---

const getCapsules = async (userId: string): Promise<TimeCapsule[]> => {
  try {
    if (!userId) return [];
    const jsonValue = await AsyncStorage.getItem(getStorageKey(userId));
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Failed to fetch capsules", e);
    return [];
  }
};

const saveCapsules = async (userId: string, capsules: TimeCapsule[]) => {
  try {
    if (!userId) return;
    await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(capsules));
  } catch (e) {
    console.error("Failed to save capsules", e);
  }
};

// --- Hooks ---

export const useTimeCapsules = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["timeCapsules", user?.uid], // Key depends on User
    queryFn: () => getCapsules(user?.uid || ""),
    enabled: !!user?.uid, // Only fetch if user exists
    select: (data) => {
      // Sort by unlock date (nearest first)
      return data.sort(
        (a, b) =>
          new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
      );
    },
  });
};

export const useAddTimeCapsule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newCapsule: Omit<TimeCapsule, "id" | "createdAt" | "userId">) => {
      if (!user?.uid) throw new Error("User not authenticated");
      
      const capsules = await getCapsules(user.uid);
      const capsule: TimeCapsule = {
        ...newCapsule,
        id: Date.now().toString(),
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      const updatedCapsules = [...capsules, capsule];
      await saveCapsules(user.uid, updatedCapsules);
      return capsule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeCapsules"] });
      Toast.show({
        type: "success",
        text1: "Capsule Locked! 🔒",
        text2: "Your message has been sent to the future.",
        position: "top",
        visibilityTime: 4000
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to seal time capsule.",
        position: "top"
      });
      console.error(error);
    },
  });
};

export const useDeleteTimeCapsule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user?.uid) return;
      
      const capsules = await getCapsules(user.uid);
      const updatedCapsules = capsules.filter((c) => c.id !== id);
      await saveCapsules(user.uid, updatedCapsules);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeCapsules"] });
    },
  });
};

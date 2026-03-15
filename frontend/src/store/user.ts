import { defineStore } from "pinia";
import { ref } from "vue";
import { getCurrentUser } from "@/services/api";
import type { AuthUser } from "@/types";

export const useUserStore = defineStore("user", () => {
  const user = ref<AuthUser | null>(null);

  const isSessionInitialized = ref(false);
  const isSessionLoading = ref(false);

  const setUser = (userData: AuthUser | null) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  const initSession = async () => {
    if (isSessionInitialized.value || isSessionLoading.value) {
      return;
    }

    isSessionLoading.value = true;

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      clearUser();
    } finally {
      isSessionInitialized.value = true;
      isSessionLoading.value = false;
    }
  };

  const isAuthenticated = () => Boolean(user.value);

  return {
    user,
    isSessionInitialized,
    isSessionLoading,
    setUser,
    clearUser,
    initSession,
    isAuthenticated,
  };
});

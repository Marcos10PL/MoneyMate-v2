<script setup lang="ts">
import { computed } from "vue";
import { Toast } from "primevue";
import { useUserStore } from "@/store/user";
import AppSpinner from "./components/AppSpinner.vue";
import AppLogo from "./components/AppLogo.vue";

const userStore = useUserStore();
const isLoading = computed(
  () => !userStore.isSessionInitialized || userStore.isSessionLoading,
);
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 gap-2 flex flex-col items-center justify-center"
  >
    <AppSpinner />
    <AppLogo />
  </div>
  <template v-else>
    <RouterView />
    <Toast />
  </template>
</template>

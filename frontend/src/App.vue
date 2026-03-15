<script setup lang="ts">
import { Toast } from "primevue";
import AppSpinner from "./components/AppSpinner.vue";
import AppLogo from "./components/AppLogo.vue";
import { useInitStore } from "./store/init";

const init = useInitStore();
</script>

<template>
  <div
    v-if="init.loading"
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

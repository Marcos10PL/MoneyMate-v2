<script setup lang="ts">
import { ref } from "vue";
import { Button } from "primevue";

const isDark = ref(document.documentElement.classList.contains("my-app-dark"));

function toggleTheme() {
  document.documentElement.classList.toggle("my-app-dark");
  isDark.value = document.documentElement.classList.contains("my-app-dark");
}
</script>

<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    rounded
    size="small"
    severity="secondary"
    @click="toggleTheme"
  />
</template>

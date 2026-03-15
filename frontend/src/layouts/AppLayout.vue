<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppNav from "@/components/AppNav.vue";
</script>

<template>
  <header>
    <AppNav />
  </header>
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>

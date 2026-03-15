<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppNav from "@/components/AppNav.vue";
import Container from "@/components/ui/Container.vue";
</script>

<template>
  <header class="border-b border-gray-400">
    <AppNav />
  </header>
  <Container as="main" class="py-4 px-4 md:px-8">
    <RouterView />
  </Container>
  <AppFooter />
</template>

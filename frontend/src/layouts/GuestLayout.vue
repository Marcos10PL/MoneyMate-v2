<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import Header from "@/components/auth/Header.vue";
</script>

<template>
  <div class="max-w-sm mx-auto h-dvh flex flex-col justify-center gap-2 px-2">
    <header>
      <Header />
    </header>

    <main>
      <RouterView />
    </main>

    <AppFooter class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import { GUEST_LINKS } from "@/const";
import { Button } from "primevue";
</script>

<template>
  <div class="h-dvh flex flex-col justify-center gap-2 max-w-md mx-auto">
    <h1 class="text-4xl font-semibold">Page not found</h1>
    <p class="text-xl">The page you are looking for does not exist.</p>

    <div class="flex gap-2 mt-4">
      <Button
        label="Go Home"
        class="w-full"
        size="small"
        outlined
        @click="$router.push(GUEST_LINKS.HOME)"
      >
      </Button>

      <Button
        label="Go Back"
        class="w-full"
        size="small"
        outlined
        @click="$router.back()"
      >
      </Button>
    </div>
  </div>
</template>

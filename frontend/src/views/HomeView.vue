<script setup lang="ts">
import { GUEST_LINKS } from "@/const";
import Button from "primevue/button";
</script>

<template>
  <p class="py-4">
    Welcome to MoneyMate! Please log in or register to start managing your
    finances.
  </p>
  <Button
    label="Get Started"
    class="w-full"
    size="small"
    outlined
    @click="$router.push(GUEST_LINKS.SIGN_IN)"
  />
</template>

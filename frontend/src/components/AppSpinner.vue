<script setup lang="ts">
import { ProgressSpinner } from "primevue";
</script>

<template>
  <ProgressSpinner
    style="width: 50px; height: 50px"
    strokeWidth="8"
    fill="transparent"
    animationDuration=".5s"
  />
</template>

<style>
.p-progressspinner-circle {
  stroke: var(--color-primary) !important;
}
</style>

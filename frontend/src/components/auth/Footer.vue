<script setup lang="ts">
import Link from "../ui/Link.vue";

defineProps<{
  info: string;
  href: string;
  text: string;
}>();
</script>

<template>
  <p class="text-sm">
    {{ info }}
    <Link :href="href" :text="text" />
  </p>
</template>

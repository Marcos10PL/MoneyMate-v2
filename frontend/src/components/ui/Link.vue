<script setup lang="ts">
defineProps<{
  href: string;
  label?: string;
}>();
</script>

<template>
  <RouterLink
    :to="href"
    class="underline text-primary hover:opacity-80 transition-opacity"
  >
    <slot>
      {{ label }}
    </slot>
  </RouterLink>
</template>

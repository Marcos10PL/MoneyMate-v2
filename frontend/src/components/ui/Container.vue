<script setup lang="ts">
const { as = "div" } = defineProps<{
  as?: "div" | "section" | "main" | "nav" | "header" | "footer";
}>();
</script>

<template>
  <component
    :is="as"
    class="w-full max-w-7xl gap-2 mx-auto px-2 md:px-6"
  >
    <slot />
  </component>
</template>

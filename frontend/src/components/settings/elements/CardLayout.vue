<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div
    class="border border-gray-500 rounded-lg py-2 px-3 flex gap-x-6 gap-y-2 flex-wrap justify-between items-center"
  >
    <h3 class="font-semibold truncate">{{ title }}</h3>

    <slot />
  </div>
</template>

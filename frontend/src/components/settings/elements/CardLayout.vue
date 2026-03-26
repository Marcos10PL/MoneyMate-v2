<script setup lang="ts">
const { dropIcon = false } = defineProps<{
  title: string;
  dropIcon?: boolean;
}>();
</script>

<template>
  <div
    class="border border-gray-500 rounded-lg py-2 px-3 flex gap-x-6 gap-y-2 flex-wrap justify-between items-center"
  >
    <h3 class="font-semibold truncate flex items-center gap-2 pr-2.5">
      <i class="pi pi-angle-down text-2xl text-gray-400" v-if="dropIcon" />
      {{ title }}
    </h3>

    <slot />
  </div>
</template>

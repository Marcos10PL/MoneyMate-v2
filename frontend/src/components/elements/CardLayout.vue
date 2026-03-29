<script setup lang="ts">
const { dropIcon = false } = defineProps<{
  title: string;
  dropIcon?: boolean;
}>();
</script>

<template>
  <div
    class="border dark:border-zinc-700 border-zinc-200 rounded-lg py-2 px-3 flex gap-x-6 gap-y-2 flex-wrap justify-between items-center dark:bg-zinc-900 bg-zinc-50"
  >
    <h3 class="font-semibold truncate flex items-center gap-2 pr-2.5">
      <i class="pi pi-angle-down text-2xl text-gray-400" v-if="dropIcon" />
      {{ title }}
    </h3>

    <slot />
  </div>
</template>

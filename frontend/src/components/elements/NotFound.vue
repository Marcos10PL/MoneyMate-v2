<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>

<template>
  <div
    class="italic text-center py-6 text-gray-400 bg-zinc-900 rounded-xl"
  >
    {{ text ?? "Not found." }}
  </div>
</template>

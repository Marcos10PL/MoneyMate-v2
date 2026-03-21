<script setup lang="ts">
import type { AccountSummary, Category } from "@/types";
import { Button } from "primevue";
import ActionButtons from "./ActionButtons.vue";
import CardLayout from "./CardLayout.vue";

defineProps<{
  category: Category;
}>();
</script>

<template>
  <CardLayout :title="category.name">
    <div class="flex items-center gap-4" v-if="!category.is_global">
      <ActionButtons @edit="$emit('edit')" @delete="$emit('delete')" />
    </div>
  </CardLayout>
</template>

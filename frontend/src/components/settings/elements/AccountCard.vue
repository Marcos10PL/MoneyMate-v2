<script setup lang="ts">
import type { AccountSummary } from "@/types";
import { Button } from "primevue";
import ActionButtons from "./ActionButtons.vue";
import CardLayout from "./CardLayout.vue";

const { showActions = true, dropIcon = false } = defineProps<{
  account: AccountSummary;
  showActions?: boolean;
  dropIcon?: boolean;
}>();
</script>

<template>
  <CardLayout :title="account.name" :dropIcon>
    <div class="flex items-center gap-4">
      <p class="text-sm font-medium text-primary">
        <i class="pi pi-wallet mr-1 text-sm!" />
        {{ account.balance }}
      </p>
      <p class="text-sm font-medium text-green-400">
        <i class="pi pi-arrow-up mr-1 text-sm!" />
        {{ account.income_sum }}
      </p>
      <p class="text-sm font-medium text-red-400">
        <i class="pi pi-arrow-down mr-1 text-sm!" />
        {{ account.expense_sum }}
      </p>

      <template v-if="showActions">
        <div class="w-[1px] min-h-8 -mr-1.5 bg-gray-500"></div>

        <ActionButtons @edit="$emit('edit')" @delete="$emit('delete')" />
      </template>
    </div>
  </CardLayout>
</template>

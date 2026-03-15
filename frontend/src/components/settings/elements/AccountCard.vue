<script setup lang="ts">
import type { AccountSummary } from "@/types";

defineProps<{
  account: AccountSummary;
}>();
</script>

<template>
  <div
    class="border border-gray-500 rounded-lg py-1 px-3 flex gap-x-6 gap-y-2 flex-wrap justify-between"
  >
    <h3 class="font-semibold">{{ account.name }}</h3>
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
    </div>
  </div>
</template>

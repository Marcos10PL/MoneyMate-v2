<script setup lang="ts">
import { SUMMARY_COLORS, SUMMARY_ICONS } from "@/const";
import { formatPrice } from "@/utils";

defineProps<{
  income_sum: number;
  expense_sum: number;
  balance: number;
}>();
</script>

<template>
  <div class="flex gap-4 text-sm">
    <p :class="['font-medium', SUMMARY_COLORS.INCOME]">
      <i :class="SUMMARY_ICONS.INCOME" class="mr-1 text-sm!" />
      {{ formatPrice(income_sum) }}
    </p>
    <p :class="['font-medium', SUMMARY_COLORS.EXPENSE]">
      <i :class="SUMMARY_ICONS.EXPENSE" class="mr-1 text-sm!" />
      {{ formatPrice(expense_sum) }}
    </p>
    <p :class="['font-medium', SUMMARY_COLORS.BALANCE]">
      <i :class="SUMMARY_ICONS.BALANCE" class="mr-1 text-sm!" />
      {{ formatPrice(balance) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { TransactionTypeEnum, type Transaction } from "@/types";
import ActionButtons from "../elements/ActionButtons.vue";
import CardLayout from "../elements/CardLayout.vue";
import { SUMMARY_COLORS, SUMMARY_ICONS } from "@/const";
import { formatDate, formatPrice } from "@/utils";

defineProps<{
  transaction: Transaction;
}>();

defineEmits(["edit", "delete"]);
</script>

<template>
  <CardLayout :title="transaction.name">
    <p class="text-sm text-gray-400 italic -ml-4 mr-auto">
      {{ transaction.category }}
    </p>
    <div class="flex items-center flex-wrap gap-4">
      <p
        class="text-sm font-medium"
        :class="
          transaction.type === TransactionTypeEnum.INCOME
            ? SUMMARY_COLORS.INCOME
            : SUMMARY_COLORS.EXPENSE
        "
      >
        <i
          class="mr-1 text-sm!"
          :class="
            transaction.type === TransactionTypeEnum.INCOME
              ? SUMMARY_ICONS.INCOME
              : SUMMARY_ICONS.EXPENSE
          "
        />
        {{ formatPrice(Number(transaction.amount)) }}
      </p>
      <p class="text-sm text-gray-400">{{ formatDate(transaction.date) }}</p>
      <div class="w-[1px] min-h-8 -mr-1.5 bg-gray-500"></div>
      <ActionButtons @edit="$emit('edit')" @delete="$emit('delete')" />
    </div>
  </CardLayout>
</template>

<script setup lang="ts">
import type { AccountSummary } from "@/types";
import { Button } from "primevue";
import ActionButtons from "../../elements/ActionButtons.vue";
import CardLayout from "../../elements/CardLayout.vue";
import Summary from "@/components/elements/Summary.vue";

const { showActions = true, dropIcon = false } = defineProps<{
  account: AccountSummary;
  showActions?: boolean;
  dropIcon?: boolean;
}>();
</script>

<template>
  <CardLayout :title="account.name" :dropIcon>
    <div class="flex items-center gap-4">
      <Summary
        :income_sum="account.income_sum"
        :expense_sum="account.expense_sum"
        :balance="account.balance"
      />

      <template v-if="showActions">
        <div class="w-[1px] min-h-8 -mr-1.5 bg-gray-500"></div>

        <ActionButtons @edit="$emit('edit')" @delete="$emit('delete')" />
      </template>
    </div>
  </CardLayout>
</template>

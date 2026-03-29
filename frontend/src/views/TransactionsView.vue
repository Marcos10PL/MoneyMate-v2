<script setup lang="ts">
import NoAccount from "@/components/elements/NoAccount.vue";
import SelectAccount from "@/components/transactions/SelectAccount.vue";
import TransactionList from "@/components/transactions/TransactionList.vue";
import { useAccountsStore } from "@/store/accounts";

const accountStore = useAccountsStore();
</script>

<template>
  <NoAccount v-if="accountStore.accounts.length === 0" />
  <div v-else>
    <SelectAccount />
    <TransactionList />
  </div>
</template>

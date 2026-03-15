<script setup lang="ts">
import { useAccountsStore } from "@/store/accounts";
import AccountCard from "./elements/AccountCard.vue";

const accountsStore = useAccountsStore();
</script>

<template>
  <AccountCard
    v-for="account in accountsStore.accounts"
    :key="account.id"
    :account="account"
  />
</template>

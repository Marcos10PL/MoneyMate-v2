<script setup lang="ts">
import NoAccount from "@/components/elements/NoAccount.vue";
import SelectAccount from "@/components/transactions/SelectAccount.vue";
import Container from "@/components/ui/Container.vue";
import { useAccountsStore } from "@/store/accounts";
import { useCategoriesStore } from "@/store/categories";
import { Button, Popover, Select } from "primevue";
import { computed, ref, useTemplateRef, watch } from "vue";

const accountStore = useAccountsStore();
const categoriesStore = useCategoriesStore();
</script>

<template>
  <NoAccount v-if="accountStore.accounts.length === 0" />
  <SelectAccount v-else />
</template>

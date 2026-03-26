<script setup lang="ts">
import { APP_LINKS, SETTINGS_TABS } from "@/const";
import { Button, Card } from "primevue";

const info = [
  "Track your expenses and income",
  "Visualize your financial data with charts",
  "Create few accounts to separate your finances",
  "Create categories to better organize your transactions",
] as const;
</script>

<template>
  <Card class="p-2 border border-primary">
    <template #title>
      <div class="flex items-center gap-3">
        <i class="pi pi-wallet text-4xl text-primary" />
        Create an account to get started!
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 py-8 rounded-xl">
        <p
          v-for="(item, index) in info"
          :key="index"
          class="flex items-center gap-3"
        >
          <i class="pi pi-check text-green-400 text-2xl" />
          {{ item }}
        </p>
      </div>
    </template>
    <template #footer>
      <Button
        label="Create Account"
        class="w-full"
        @click="
          $router.push({
            path: APP_LINKS.SETTINGS,
            query: { tab: SETTINGS_TABS.ACCOUNTS.value },
          })
        "
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useAccountsStore } from "@/store/accounts";
import { Popover } from "primevue"
import { useTemplateRef } from "vue";
import AccountCard from "../settings/elements/AccountCard.vue"
import CardLayout from "../settings/elements/CardLayout.vue"
import Container from "../ui/Container.vue"

const accountStore = useAccountsStore();

const op = useTemplateRef("op");

const toggle = (event: MouseEvent) => {
  if (op.value) op.value.toggle(event);
};
</script>

<template>
  <div>
    <div class="flex *:flex-1 gap-2">
      <AccountCard
        v-if="accountStore.selectedAccount"
        :account="accountStore.selectedAccount"
        :showActions="false"
        class="cursor-pointer hover:bg-gray-500/10 transition-colors"
        @click="toggle"
        dropIcon
      />

      <CardLayout
        v-else
        title="Select an account"
        class="text-gray-400 italic cursor-pointer hover:bg-gray-500/10 transition-colors"
        @click="toggle"
        dropIcon
      />
    </div>

    <Popover ref="op" unstyled class="w-full">
      <Container class="px-4! md:px-8! mt-1 py-2 rounded-xl">
        <div class="bg-white dark:bg-zinc-900 dark:border-zinc-70 rounded-xl">
          <AccountCard
            v-for="account in accountStore.accounts"
            :key="account.id"
            :account="account"
            :showActions="false"
            @click="
              () => {
                accountStore.selectedAccount = account;
                if (op) op.hide();
              }
            "
            class="w-full mb-2 last:mb-0 cursor-pointer hover:bg-gray-500/10 transition-colors"
            :class="{
              'opacity-75 pointer-events-none':
                accountStore.selectedAccount?.id === account.id,
            }"
          />
        </div>
      </Container>
    </Popover>
  </div>
</template>

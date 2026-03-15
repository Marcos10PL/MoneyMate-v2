<script setup lang="ts">
import { computed } from "vue";

import { useRoute, useRouter } from "vue-router";
import { Menubar } from "primevue";
import { APP_LINKS, APP_LINKS_ICONS } from "@/const";
import type { MenuItem } from "primevue/menuitem";
import AppThemeSwicther from "./AppThemeSwicther.vue";
import AppLogo from "./AppLogo.vue";
import Logout from "./auth/Logout.vue";
import Container from "./ui/Container.vue";
const router = useRouter();
const route = useRoute();

const items = computed<MenuItem[]>(() =>
  Object.entries(APP_LINKS).map(([key, value]) => ({
    label: key.slice(0, 1).toUpperCase() + key.slice(1).toLocaleLowerCase(),
    icon: APP_LINKS_ICONS[key as keyof typeof APP_LINKS_ICONS],
    command: () => router.push(value),
    class:
      route.path === value
        ? "is-active-route rounded-md text-sm font-medium transition-colors text-[var(--p-menubar-item-focus-color)] bg-[var(--p-menubar-item-focus-background)]"
        : "text-sm font-medium transition-colors",
  })),
);
</script>

<template>
  <Container as="nav" class="flex items-center gap-2">
    <Menubar :model="items" class="bg-transparent! w-full border-0! px-0!">
      <template #end>
        <div class="flex items-center gap-2">
          <AppThemeSwicther />
          <Logout />
        </div>
      </template>
    </Menubar>
  </Container>
</template>

<style scoped>
:deep(
  .p-menubar-item.is-active-route > .p-menubar-item-content .p-menubar-item-icon
),
:deep(
  .p-menubar-item.is-active-route
    > .p-menubar-item-content
    .p-menubar-submenu-icon
) {
  color: var(--p-menubar-item-icon-focus-color);
}

:deep(.p-menubar-end) {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>

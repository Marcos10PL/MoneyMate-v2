<script setup lang="ts">
import Accounts from "@/components/settings/Accounts.vue";
import Categories from "@/components/settings/Categories.vue";
import { SETTINGS_TABS } from "@/const";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const activeTab = ref<string>(route.query.tab as string);

watch(activeTab, newTab => {
  router.replace({ query: { ...route.query, tab: newTab } });
});
</script>

<template>
  <Tabs :value="activeTab" @update:value="activeTab = $event as string">
    <TabList class="bg-transparent!">
      <Tab :value="SETTINGS_TABS.CATEGORIES.value">{{
        SETTINGS_TABS.CATEGORIES.label
      }}</Tab>
      <Tab :value="SETTINGS_TABS.ACCOUNTS.value">{{
        SETTINGS_TABS.ACCOUNTS.label
      }}</Tab>
    </TabList>
    <TabPanels class="bg-transparent! p-0!">
      <TabPanel :value="SETTINGS_TABS.CATEGORIES.value">
        <Categories />
      </TabPanel>
      <TabPanel :value="SETTINGS_TABS.ACCOUNTS.value">
        <Accounts />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

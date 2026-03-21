<script setup lang="ts">
import Accounts from "@/components/settings/Accounts.vue";
import Categories from "@/components/settings/Categories.vue";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
</script>

<template>
  <Tabs value="0">
    <TabList class="bg-transparent!">
      <Tab value="0">Categories</Tab>
      <Tab value="1">Accounts</Tab>
    </TabList>
    <TabPanels class="bg-transparent! p-0!">
      <TabPanel value="0">
        <Categories />
      </TabPanel>
      <TabPanel value="1">
        <Accounts />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

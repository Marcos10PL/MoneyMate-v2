<script setup lang="ts">
import { useCategoriesStore } from "@/store/categories";
import { useTransactionTypesStore } from "@/store/transactionTypes";
import type { TransactionFilters } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
  Button,
  DatePicker,
  Select,
} from "primevue";
import { computed } from "vue";

const categoriesStore = useCategoriesStore();
const typesStore = useTransactionTypesStore();

defineEmits<{
  (e: "reset"): void;
}>();

const filters = defineModel<TransactionFilters>({
  default: () => ({
    typeId: undefined,
    categoryId: undefined,
    startDate: undefined,
    endDate: undefined,
  }),
});

const activeFiltersCount = computed(() => {
  let count = 0;

  Object.values(filters.value).forEach(value => {
    if (value) count++;
  });

  return count;
});
</script>

<template>
  <Accordion class="-mt-2.5">
    <AccordionPanel value="0" class="border-0!">
      <AccordionHeader class="py-3! bg-transparent! px-0!">
        <div class="flex w-full items-center justify-between">
          <h3 class="flex items-center gap-2 font-medium">
            <i class="pi pi-filter" />

            <span>
              Filters
              <template v-if="activeFiltersCount > 0">
                ({{ activeFiltersCount }} active)
              </template>
            </span>
          </h3>
          <Button
            label="Reset"
            severity="secondary"
            outlined
            size="small"
            @click.stop="$emit('reset')"
            class="mr-4"
          />
        </div>
      </AccordionHeader>
      <AccordionContent class="*:*:px-0! *:*:bg-transparent!">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Select
            v-model="filters.typeId"
            :options="typesStore.types"
            optionLabel="name"
            optionValue="id"
            placeholder="Type"
            size="small"
            showClear
          />

          <Select
            v-model="filters.categoryId"
            :options="categoriesStore.categories"
            optionLabel="name"
            optionValue="id"
            placeholder="Category"
            size="small"
            showClear
          />

          <DatePicker
            v-model="filters.startDate"
            placeholder="Date from"
            size="small"
            showIcon
            showClear
            iconDisplay="input"
            :dateFormat="'dd.mm.yy'"
            :manualInput="false"
            :showOnFocus="false"
          />

          <DatePicker
            v-model="filters.endDate"
            placeholder="Date to"
            size="small"
            showIcon
            showClear
            iconDisplay="input"
            :dateFormat="'dd.mm.yy'"
            :manualInput="false"
            :showOnFocus="false"
          />
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>

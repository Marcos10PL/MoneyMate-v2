<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionPanel,
  Button,
  Dialog,
  useToast,
} from "primevue";
import type { Category } from "@/types";
import ConfirmModal from "../ui/ConfirmModal.vue";
import { useCategoriesStore } from "@/store/categories";
import FormCategory from "../forms/FormCategory.vue";
import CategoryCard from "./elements/CategoryCard.vue";

const categoriesStore = useCategoriesStore();
const { deleteCategory } = categoriesStore;

const toast = useToast();
const modal = ref(false);
const isUpdating = ref(false);
const deleteModal = ref(false);
const categoryValue = ref<Category | null>(null);

const reset = () => {
  isUpdating.value = false;
  categoryValue.value = null;
  modal.value = false;
  deleteModal.value = false;
  categoryValue.value = null;
};

const handleDelete = async () => {
  try {
    await deleteCategory(categoryValue.value!.id);

    toast.add({
      severity: "success",
      summary: "Category deleted successfully",
    });

    reset();
  } catch {
    toast.add({
      severity: "error",
      summary: "Failed to delete category",
    });
  }
};
</script>

<template>
  <div class="space-y-4">
    <Button
      icon="pi pi-plus"
      size="small"
      outlined
      severity="primary"
      class="min-w-full mt-4"
      label="Create new category"
      @click="
        modal = true;
        isUpdating = false;
      "
      :loading="categoriesStore.isCreating"
    />

    <Accordion value="0" class="-mt-2">
      <AccordionPanel value="0">
        <AccordionHeader class="bg-transparent! px-0!">Yours</AccordionHeader>
        <AccordionContent class="*:*:px-0! *:*:bg-transparent!">
          <div
            v-if="categoriesStore.userCategories.length === 0"
            class="italic text-center py-4 border border-gray-500 text-gray-400"
          >
            No categories found. Create your first category to improve your financial tracking!
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryCard
              v-for="category in categoriesStore.userCategories"
              :key="category.id"
              :category="category"
              @edit="
                modal = true;
                isUpdating = true;
                categoryValue = category;
              "
              @delete="
                deleteModal = true;
                categoryValue = category;
              "
            />
          </div>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader class="bg-transparent! px-0!">Global</AccordionHeader>
        <AccordionContent class="*:*:px-0! *:*:bg-transparent!">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <CategoryCard
              v-for="category in categoriesStore.globalCategories"
              :key="category.id"
              :category="category"
              @edit="
                modal = true;
                isUpdating = true;
                categoryValue = category;
              "
              @delete="
                deleteModal = true;
                categoryValue = category;
              "
            />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <!-- MODALS -->
    <Dialog
      v-model:visible="modal"
      modal
      :header="isUpdating ? 'Update category' : 'Create category'"
      :style="{ width: '25rem' }"
    >
      <FormCategory v-if="!isUpdating" @success="reset" />
      <FormCategory
        v-else
        :isUpdating="true"
        :category="categoryValue!"
        @success="reset"
      />
    </Dialog>

    <ConfirmModal
      v-model="deleteModal"
      confirmLabel="Delete"
      title="Delete category"
      :loading="categoriesStore.isDeleting"
      :action="handleDelete"
      description="Are you sure you want to delete this category? This action cannot be undone."
    />
  </div>
</template>

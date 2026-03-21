import {
  getCategories,
  deleteCategory as deleteCat,
  createCategory as createCat,
  updateCategory as updateCat,
} from "@/services/api";
import type { Category, CategoryPayload } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useAsyncRequest } from "@/composables/useAsyncRequest";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const isInitialLoaded = ref(false);

  const globalCategories = computed(() =>
    categories.value.filter(cat => cat.is_global),
  );

  const userCategories = computed(() =>
    categories.value.filter(cat => !cat.is_global),
  );

  const fetchReq = useAsyncRequest();
  const deleteReq = useAsyncRequest();
  const createReq = useAsyncRequest();
  const updateReq = useAsyncRequest();

  async function fetchCategories(force = false) {
    await fetchReq.run(
      async () => {
        const res = await getCategories();
        categories.value = res.categories;
      },
      force,
      () => {
        isInitialLoaded.value = true;
      },
    );
  }

  async function deleteCategory(id: number) {
    await deleteReq.run(async () => {
      await deleteCat(id);
      categories.value = categories.value.filter(cat => cat.id !== id);
    });
  }

  async function updateCategory(id: number, payload: CategoryPayload) {
    await updateReq.run(async () => {
      const updatedCategory = await updateCat(id, payload);
      categories.value = categories.value.map(cat =>
        cat.id === id ? { ...cat, ...updatedCategory.category } : cat,
      );
    });
  }

  async function createCategory(payload: CategoryPayload) {
    await createReq.run(async () => {
      const newCategory = await createCat(payload);
      categories.value.push(newCategory.category);
    });
  }

  const clearCategories = () => {
    categories.value = [];
    isInitialLoaded.value = false;
  };

  return {
    categories,
    isInitialLoaded,
    clearCategories,

    globalCategories,
    userCategories,

    fetchCategories,
    isFetching: fetchReq.isLoading,
    fetchError: fetchReq.error,

    deleteCategory,
    isDeleting: deleteReq.isLoading,
    deleteError: deleteReq.error,

    createCategory,
    isCreating: createReq.isLoading,
    createError: createReq.error,

    updateCategory,
    isUpdating: updateReq.isLoading,
    updateError: updateReq.error,
  };
});

import {
  getCategories,
  deleteCategory as deleteCat,
  createCategory as createCat,
} from "@/services/api";
import type { AccountPayload, Category } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAsyncRequest } from "@/composables/useAsyncRequest";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const isInitialLoaded = ref(false);

  const fetchReq = useAsyncRequest();
  const deleteReq = useAsyncRequest();
  const createReq = useAsyncRequest();

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

  async function createCategory(payload: AccountPayload) {
    await createReq.run(async () => {
      const newCategory = await createCat(payload);
      categories.value.push(newCategory.category);
    });
  }

  return {
    categories,
    isInitialLoaded,

    fetchCategories,
    isFetching: fetchReq.isLoading,
    fetchError: fetchReq.error,

    deleteCategory,
    isDeleting: deleteReq.isLoading,
    deleteError: deleteReq.error,

    createCategory,
    isCreating: createReq.isLoading,
    createError: createReq.error,
  };
});

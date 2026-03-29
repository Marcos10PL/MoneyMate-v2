import { getTypes } from "@/services/api";
import type { TransactionType } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAsyncRequest } from "@/composables/useAsyncRequest";

export const useTransactionTypesStore = defineStore("transactionTypes", () => {
  const types = ref<TransactionType[]>([]);
  const isInitialLoaded = ref(false);

  const fetchReq = useAsyncRequest();

  async function fetchTypes(force = false) {
    await fetchReq.run(
      async () => {
        const res = await getTypes();
        types.value = res.types.map(type => ({
          id: type.id,
          name: type.name.toUpperCase(),
        }));
      },
      force,
      () => {
        isInitialLoaded.value = true;
      },
    );
  }

  const clearTypes = () => {
    types.value = [];
    isInitialLoaded.value = false;
  };

  return {
    types,
    isInitialLoaded,
    clearTypes,

    fetchTypes,
    isFetching: fetchReq.isLoading,
    fetchError: fetchReq.error,
  };
});

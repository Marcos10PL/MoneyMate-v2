import { defineStore } from "pinia";
import { ref } from "vue";

export const useInitStore = defineStore("init", () => {
  const loading = ref(true);

  return {
    loading,
  };
});

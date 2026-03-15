import { ref } from "vue";

export function useAsyncRequest() {
  const isLoading = ref(false);
  const error = ref(false);

  async function run<T>(
    action: () => Promise<T>,
    force = false,
    finalAction?: () => void,
  ): Promise<T | undefined> {
    if (isLoading.value && !force) {
      return;
    }

    isLoading.value = true;
    error.value = false;

    try {
      return await action();
    } catch (e) {
      console.error(e);
      error.value = true;
      throw e;
    } finally {
      finalAction?.();
      isLoading.value = false;
    }
  }

  return { isLoading, error, run };
}

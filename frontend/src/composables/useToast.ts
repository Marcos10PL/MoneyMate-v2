import { DEFAULT_TOAST_LIFE_MS } from "@/const";
import { useToast as usePrimeToast } from "primevue";
import type { ToastMessageOptions } from "primevue";

export function useToast() {
  const toast = usePrimeToast();

  return {
    add: (message: ToastMessageOptions) =>
      toast.add({ life: DEFAULT_TOAST_LIFE_MS, ...message }),
  };
}

import {
  getAccounts,
  deleteAccount as deleteAcc,
  updateAccount as updateAcc,
  createAccount as createAcc,
} from "@/services/api";
import type { AccountPayload, AccountSummary } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useAsyncRequest } from "@/composables/useAsyncRequest";

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<AccountSummary[]>([]);
  const isInitialLoaded = ref(false);

  const fetchReq = useAsyncRequest();
  const deleteReq = useAsyncRequest();
  const updateReq = useAsyncRequest();
  const createReq = useAsyncRequest();

  async function fetchAccounts(force = false) {
    await fetchReq.run(
      async () => {
        const res = await getAccounts();
        accounts.value = res.accounts;
      },
      force,
      () => {
        isInitialLoaded.value = true;
      },
    );
  }

  async function deleteAccount(id: number) {
    await deleteReq.run(async () => {
      await deleteAcc(id);
      accounts.value = accounts.value.filter(acc => acc.id !== id);
    });
  }

  async function updateAccount(id: number, payload: AccountPayload) {
    await updateReq.run(async () => {
      const updatedAccount = await updateAcc(id, payload);
      accounts.value = accounts.value.map(acc =>
        acc.id === id ? { ...acc, ...updatedAccount.account } : acc,
      );
    });
  }

  async function createAccount(payload: AccountPayload) {
    await createReq.run(async () => {
      const newAccount = await createAcc(payload);
      accounts.value.push({
        ...newAccount.account,
        balance: 0,
        income_sum: 0,
        expense_sum: 0,
      });
    });
  }

  return {
    accounts,
    isInitialLoaded,

    fetchAccounts,
    isFetching: fetchReq.isLoading,
    fetchError: fetchReq.error,

    deleteAccount,
    isDeleting: deleteReq.isLoading,
    deleteError: deleteReq.error,

    updateAccount,
    isUpdating: updateReq.isLoading,
    updateError: updateReq.error,

    createAccount,
    isCreating: createReq.isLoading,
    createError: createReq.error,
  };
});

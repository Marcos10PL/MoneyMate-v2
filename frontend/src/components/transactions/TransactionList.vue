<script setup lang="ts">
import { deleteTransaction } from "@/services/api";
import { getTransactions } from "@/services/api";
import { useAccountsStore } from "@/store/accounts";
import { useAsyncRequest } from "@/composables/useAsyncRequest";
import type {
  PaginationMeta,
  SortBy,
  Transaction,
  TransactionFilters,
  TransactionsData,
} from "@/types";
import { reactive, ref, watch } from "vue";
import {
  Button,
  Dialog,
  InputText,
  Paginator,
  Select,
} from "primevue";
import { useToast } from "@/composables/useToast";
import ConfirmModal from "../ui/ConfirmModal.vue";
import FormTransaction from "../forms/FormTransaction.vue";
import TransactionCard from "./TransactionCard.vue";
import Summary from "../elements/Summary.vue";
import Filters from "./Filters.vue";
import NotFound from "../elements/NotFound.vue";

// stores & refs
const accountsStore = useAccountsStore();
const toast = useToast();

const transactions = ref<Transaction[]>([]);
const meta = ref<PaginationMeta | null>(null);
const summary = ref<Omit<TransactionsData, "transactions"> | null>(null);
const transactionValue = ref<Transaction | null>(null);

const currentPage = ref(1);
const PER_PAGE = 10;

const modal = ref(false);
const isUpdating = ref(false);
const deleteModal = ref(false);

const fetchReq = useAsyncRequest();
const deleteReq = useAsyncRequest();

const getInitialFilters = () => {
  return {
    startDate: undefined,
    endDate: undefined,
    categoryId: undefined,
    typeId: undefined,
    sortBy: undefined,
  };
};

const search = ref("");
const sortBy = ref<SortBy>("date_desc");
const filters = reactive<TransactionFilters>(getInitialFilters());

const sortOptions = [
  { label: "Newest", value: "date_desc" },
  { label: "Oldest", value: "date_asc" },
  { label: "Highest amount", value: "amount_desc" },
  { label: "Lowest amount", value: "amount_asc" },
];

// search
const searchInput = ref("");
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

watch(searchInput, value => {
  if (searchDebounce) {
    clearTimeout(searchDebounce);
  }

  searchDebounce = setTimeout(() => {
    search.value = value;
  }, 300);
});

// fetch transactions
const fetchTransactions = async (page = currentPage.value) => {
  if (!accountsStore.selectedAccount) return;

  try {
    await fetchReq.run(async () => {
      const res = await getTransactions({
        accountId: accountsStore.selectedAccount!.id,
        ...filters,
        ...(sortBy.value && { sortBy: sortBy.value }),
        ...(search.value && { search: search.value }),
        page,
        perPage: PER_PAGE,
      });

      transactions.value = res.data.transactions;
      meta.value = res.meta;
      summary.value = {
        income_sum: res.data.income_sum,
        expense_sum: res.data.expense_sum,
        balance: res.data.balance,
      };
    });
  } catch {
    toast.add({ severity: "error", summary: "Failed to fetch transactions" });
  }
};

// delete transaction
const handleDelete = async () => {
  try {
    await deleteReq.run(async () => {
      await deleteTransaction(transactionValue.value!.id);
    });
    toast.add({
      severity: "success",
      summary: "Transaction deleted successfully",
    });

    await reset();
  } catch {
    toast.add({ severity: "error", summary: "Failed to delete transaction" });
  }
};

// handlers
async function reset() {
  isUpdating.value = false;
  transactionValue.value = null;
  modal.value = false;
  deleteModal.value = false;

  await Promise.all([
    accountsStore.refreshSelectedAccount(),
    fetchTransactions(),
  ]);
}

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1;
  fetchTransactions(currentPage.value);
};

const resetFilters = async () => {
  if (JSON.stringify(filters) === JSON.stringify(getInitialFilters())) return;

  Object.assign(filters, getInitialFilters());

  currentPage.value = 1;
  await fetchTransactions(1);
};

// reset transactions when account changes
watch(
  [() => accountsStore.selectedAccount?.id, filters, sortBy, search],
  async ([accountId], [previousAccountId]) => {
    if (accountId) {
      if (accountId !== previousAccountId) {
        currentPage.value = 1;
        transactions.value = [];
      }

      await fetchTransactions(currentPage.value);
    } else {
      currentPage.value = 1;
      transactions.value = [];
      meta.value = null;
      summary.value = null;
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div v-if="!accountsStore.selectedAccount" class="py-8">
    <NotFound text="Please select an account to view transactions" />
  </div>

  <div
    v-else
    class="space-y-4 mt-4 border-t dark:border-zinc-700 border-zinc-200 pt-4"
  >
    <Filters @reset="resetFilters" v-model="filters" />

    <div
      class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center -mt-4 border-b dark:border-zinc-700 border-zinc-200 pb-4"
    >
      <InputText
        v-model="searchInput"
        placeholder="Search by name..."
        size="small"
        class="w-full md:w-64"
      />
      <div class="flex gap-2 items-center w-full md:w-auto text-sm">
        <p class="text-nowrap">Sort by</p>
        <Select
          v-model="sortBy"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort"
          size="small"
          class="w-full md:w-54"
        />
      </div>
    </div>

    <div
      class="flex flex-col-reverse md:flex-row gap-4 items-center justify-between"
    >
      <Summary
        :income_sum="summary?.income_sum ?? 0"
        :expense_sum="summary?.expense_sum ?? 0"
        :balance="summary?.balance ?? 0"
      />
      <Button
        icon="pi pi-plus"
        size="small"
        outlined
        severity="primary"
        label="Add new transaction"
        class="w-full md:w-fit"
        @click="
          modal = true;
          isUpdating = false;
        "
      />
    </div>

    <div v-if="fetchReq.isLoading.value && transactions.length === 0" class="flex justify-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400" />
    </div>

    <template v-else>
      <NotFound v-if="transactions.length === 0" text="No transactions found" />

      <div v-else class="flex flex-col gap-2">
        <TransactionCard
          v-for="tx in transactions"
          :key="tx.id"
          :transaction="tx"
          @edit="
            modal = true;
            isUpdating = true;
            transactionValue = tx;
          "
          @delete="
            deleteModal = true;
            transactionValue = tx;
          "
        />
      </div>

      <Paginator
        v-if="meta && meta.last_page > 1"
        :rows="PER_PAGE"
        :totalRecords="meta.total"
        :first="(currentPage - 1) * PER_PAGE"
        @page="onPageChange"
        template="PrevPageLink CurrentPageReport NextPageLink"
        currentPageReportTemplate="{currentPage} / {totalPages}"
      />
    </template>

    <!-- MODALS -->
    <Dialog
      v-model:visible="modal"
      modal
      :header="isUpdating ? 'Update transaction' : 'Create transaction'"
      :style="{ width: '28rem' }"
    >
      <FormTransaction v-if="!isUpdating" @success="reset" />
      <FormTransaction
        v-else
        :key="transactionValue?.id"
        :isUpdating="true"
        :transaction="transactionValue!"
        @success="reset"
      />
    </Dialog>

    <ConfirmModal
      v-model="deleteModal"
      confirmLabel="Delete"
      title="Delete transaction"
      :loading="deleteReq.isLoading.value"
      :action="handleDelete"
      description="Are you sure you want to delete this transaction? This action cannot be undone."
    />
  </div>
</template>

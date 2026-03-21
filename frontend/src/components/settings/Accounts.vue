<script setup lang="ts">
import { useAccountsStore } from "@/store/accounts";
import AccountCard from "./elements/AccountCard.vue";
import { ref } from "vue";
import { Button, Dialog, useToast } from "primevue";
import FormAccount from "../forms/FormAccount.vue";
import type { AccountSummary } from "@/types";
import ConfirmModal from "../ui/ConfirmModal.vue";

const accountsStore = useAccountsStore();
const { deleteAccount } = accountsStore;

const toast = useToast();
const modal = ref(false);
const isUpdating = ref(false);
const deleteModal = ref(false);
const accountValue = ref<AccountSummary | null>(null);

const reset = () => {
  isUpdating.value = false;
  accountValue.value = null;
  modal.value = false;
  deleteModal.value = false;
  accountValue.value = null;
};

const handleDelete = async () => {
  try {
    await deleteAccount(accountValue.value!.id);

    toast.add({
      severity: "success",
      summary: "Account deleted successfully",
    });

    reset();
  } catch {
    toast.add({
      severity: "error",
      summary: "Failed to delete account",
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
      label="Create new account"
      @click="
        modal = true;
        isUpdating = false;
      "
      :loading="accountsStore.isCreating"
    />

    <div
      v-if="accountsStore.accounts.length === 0"
      class="italic text-center py-4 border border-gray-500 text-gray-400"
    >
      No accounts found. Create your first account to start tracking your
      finances!
    </div>

    <AccountCard
      v-else
      v-for="account in accountsStore.accounts"
      :key="account.id"
      :account="account"
      @edit="
        modal = true;
        isUpdating = true;
        accountValue = account;
      "
      @delete="
        deleteModal = true;
        accountValue = account;
      "
    />

    <!-- MODALS -->
    <Dialog
      v-model:visible="modal"
      modal
      :header="isUpdating ? 'Update account' : 'Create account'"
      :style="{ width: '25rem' }"
    >
      <FormAccount v-if="!isUpdating" @success="reset" />
      <FormAccount
        v-else
        :isUpdating="true"
        :account="accountValue!"
        @success="reset"
      />
    </Dialog>

    <ConfirmModal
      v-model="deleteModal"
      confirmLabel="Delete"
      title="Delete account"
      :loading="accountsStore.isDeleting"
      :action="handleDelete"
    >
      <p class="text-sm">
        Are you sure you want to delete this account? This action cannot be
        undone.
      </p>
      <p class="text-yellow-500 text-sm mt-2">
        Warning: All transactions linked to this account will also be deleted!
      </p>
    </ConfirmModal>
  </div>
</template>

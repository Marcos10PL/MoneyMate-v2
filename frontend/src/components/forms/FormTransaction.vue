<script setup lang="ts">
import { transactionSchema } from "@/schema";
import { useAccountsStore } from "@/store/accounts";
import { useCategoriesStore } from "@/store/categories";
import { useTransactionTypesStore } from "@/store/transactionTypes";
import { createTransaction, updateTransaction } from "@/services/api";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button, useToast } from "primevue";
import { ref } from "vue";
import type z from "zod";
import FormDateField from "../ui/FormDateField.vue";
import FormInputField from "../ui/FormInputField.vue";
import FormNumberField from "../ui/FormNumberField.vue";
import FormSelectField from "../ui/FormSelectField.vue";
import type { Transaction } from "@/types";

const toast = useToast();
const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();
const typesStore = useTransactionTypesStore();

type Props =
  | { isUpdating?: false; transaction?: never }
  | { isUpdating: true; transaction: Transaction };

const { isUpdating, transaction } = defineProps<Props>();

const emits = defineEmits(["success"]);

type Schema = z.infer<typeof transactionSchema>;

const parseAmount = (amount: string) =>
  parseFloat(amount.toString().replace(/[^0-9.-]/g, ""));

const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.substring(0, 10).split("-").map(Number);
  return new Date(year!, month! - 1, day);
};

const initialValues = ref<Partial<Schema>>({
  name: isUpdating ? transaction.name : "",
  amount: isUpdating ? parseAmount(transaction.amount) : undefined,
  type_id: isUpdating
    ? typesStore.types.find(
        t => t.name.toLowerCase() === transaction.type.toLowerCase(),
      )?.id
    : undefined,
  category_id: isUpdating
    ? categoriesStore.categories.find(
        c => c.name.toLowerCase() === transaction.category.toLowerCase(),
      )?.id
    : undefined,
  date: isUpdating ? parseDate(transaction.date) : undefined,
});

const resolver = ref(zodResolver(transactionSchema));

const isLoading = ref(false);

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid) return;

  const payload = {
    ...(values as Schema),
    account_id: accountsStore.selectedAccount?.id,
  };

  isLoading.value = true;
  try {
    if (isUpdating) {
      await updateTransaction(transaction.id, payload);
    } else {
      await createTransaction(payload);
    }

    toast.add({
      severity: "success",
      summary: isUpdating
        ? "Transaction updated successfully"
        : "Transaction created successfully",
    });

    emits("success");
  } catch {
    toast.add({
      severity: "error",
      summary: isUpdating
        ? "Failed to update transaction"
        : "Failed to create transaction",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="card flex flex-col items-center gap-5">
    <Form
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full mt-4"
    >
      <FormInputField name="name" type="text" placeholder="Name" />

      <FormNumberField
        name="amount"
        placeholder="Amount"
        :minFractionDigits="2"
        :maxFractionDigits="2"
      />

      <FormSelectField
        name="type_id"
        :options="typesStore.types"
        optionLabel="name"
        optionValue="id"
        placeholder="Type"
      />

      <FormSelectField
        name="category_id"
        :options="categoriesStore.categories"
        optionLabel="name"
        optionValue="id"
        placeholder="Category"
      />

      <FormDateField name="date" placeholder="Date" />

      <Button
        type="submit"
        size="small"
        outlined
        :label="isUpdating ? 'Update transaction' : 'Create transaction'"
        :loading="isLoading"
      />
    </Form>
  </div>
</template>

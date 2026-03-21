<script setup lang="ts">
import { accountSchema } from "@/schema";
import { useAccountsStore } from "@/store/accounts";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button, useToast } from "primevue";
import { ref } from "vue";
import type z from "zod";
import FormInputField from "../ui/FormInputField.vue";
import type { AccountSummary } from "@/types";

const toast = useToast();
const accountsStore = useAccountsStore();

type Props =
  | {
      isUpdating?: false;
      account?: never;
    }
  | {
      isUpdating: true;
      account: AccountSummary;
    };

const { isUpdating, account } = defineProps<Props>();

const emits = defineEmits(["success"]);

type Schema = z.infer<typeof accountSchema>;

const initialValues = ref<Schema>({
  name: isUpdating ? account.name : "",
});

const resolver = ref(zodResolver(accountSchema));

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid) {
    return;
  }

  try {
    if (isUpdating) {
      await accountsStore.updateAccount(account.id, values as Schema);
    } else {
      await accountsStore.createAccount(values as Schema);
    }

    toast.add({
      severity: "success",
      summary: isUpdating
        ? "Account updated successfully"
        : "Account created successfully",
    });

    emits("success");
  } catch (error) {
    const code = error instanceof Error ? (error as any).status : 500;

    if (code === 422) {
      toast.add({
        severity: "error",
        summary: isUpdating
          ? "Failed to update account"
          : "Failed to create account",
        detail: "An account with the same name already exists.",
      });
    } else {
      toast.add({
        severity: "error",
        summary: isUpdating
          ? "Failed to update account"
          : "Failed to create account",
      });
    }
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
      <Button
        type="submit"
        size="small"
        outlined
        :label="isUpdating ? 'Update account' : 'Create account'"
        :loading="isUpdating ? accountsStore.isUpdating : accountsStore.isCreating"
      />
    </Form>
  </div>
</template>

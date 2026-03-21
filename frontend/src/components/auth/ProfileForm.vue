<script setup lang="ts">
import { ref } from "vue";
import { Button, useToast } from "primevue";
import type z from "zod";
import { Form } from "@primevue/forms";
import FormInputField from "../ui/FormInputField.vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import type { AuthUser } from "@/types";
import ConfirmModal from "../ui/ConfirmModal.vue";
import { GUEST_LINKS } from "@/const";

const userStore = useUserStore();

const initialValues = ref<AuthUser>({
  id: userStore.user!.id,
  name: userStore.user!.name,
  email: userStore.user!.email,
});

const toast = useToast();

const router = useRouter();
const modal = ref(false);

async function deleteAcc() {
  try {
    await userStore.deleteAccount();
    await router.push(GUEST_LINKS.SIGN_IN);
    toast.add({
      severity: "success",
      summary: "Account deleted successfully",
    });
  } catch {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete account.",
    });
  }
}
</script>

<template>
  <div>
    <Form :initialValues class="flex flex-col gap-4 w-full mt-4 mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInputField name="name" type="text" placeholder="Name" disabled />
        <FormInputField
          name="email"
          type="email"
          placeholder="Email"
          disabled
        />
      </div>
    </Form>

    <p class="italic py-4 border border-red-400 p-6 rounded-xl mt-4">
      You can delete your account here if you no longer wish to use MoneyMate.
      Please note that this action is irreversible and will permanently remove
      all your data from our system. If you are sure you want to proceed, click
      the button below:
      <br />
      <Button
        size="small"
        label="Delete account"
        severity="danger"
        variant="text"
        :loading="userStore.deleteAccountLoading"
        class="max-w-fit inline py-0! -ml-3 mt-2"
        @click="modal = true"
      />
    </p>

    <!-- MODAL -->
    <ConfirmModal
      v-model="modal"
      :loading="userStore.deleteAccountLoading"
      title="Confirm your action"
      confirmLabel="Delete my account"
      :action="deleteAcc"
    />
  </div>
</template>

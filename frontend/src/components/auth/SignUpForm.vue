<script setup lang="ts">
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { useRouter } from "vue-router";
import { registerSchema } from "@/schema";
import FormInputField from "@/components/ui/FormInputField.vue";
import Footer from "./Footer.vue";
import { APP_LINKS, GUEST_LINKS } from "@/const";
import { register } from "@/services/api";
import { ApiError } from "@/services/errors";
import { useUserStore } from "@/store/user";

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const isSubmitting = ref(false);

type Schema = z.infer<typeof registerSchema>;

const initialValues = ref<Schema>({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const resolver = ref(zodResolver(registerSchema));

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    await register(values as Schema);
    await userStore.initSession(true);

    if (userStore.isAuthenticated()) {
      toast.add({
        severity: "success",
        summary: "Registration successful",
      });

      await router.push(APP_LINKS.DASHBOARD);
      return;
    }

    toast.add({
      severity: "success",
      summary: "Registration successful. Please log in.",
    });

    await router.push(GUEST_LINKS.SIGN_IN);
  } catch (error) {
    const code = error instanceof ApiError ? error.status : 500;

    if (code === 422) {
      toast.add({
        severity: "error",
        summary: "Registration failed",
        detail: "Email is already taken.",
      });
      return;
    }

    toast.add({
      severity: "error",
      summary: "Registration failed",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <Form
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full mt-4"
    >
      <FormInputField name="name" type="text" placeholder="Name" />
      <FormInputField name="email" type="text" placeholder="Email" />
      <FormInputField name="password" type="password" placeholder="Password" />
      <FormInputField
        name="password_confirmation"
        type="password"
        placeholder="Confirm Password"
      />
      <Button
        type="submit"
        size="small"
        outlined
        label="Create account"
        :loading="isSubmitting"
      />
    </Form>

    <Footer
      info="Don't have an account?"
      :href="GUEST_LINKS.SIGN_IN"
      text="Sign in"
    />
  </div>
</template>

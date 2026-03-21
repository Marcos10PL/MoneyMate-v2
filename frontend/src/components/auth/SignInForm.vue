<script setup lang="ts">
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { loginSchema } from "@/schema";
import FormInputField from "@/components/ui/FormInputField.vue";
import Footer from "./Footer.vue";
import { APP_LINKS, GUEST_LINKS } from "@/const";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { login } from "@/services/api";
import { ApiError } from "@/services/errors";

const toast = useToast();

const isSubmitting = ref(false);
const userStore = useUserStore();
const router = useRouter();

type Schema = z.infer<typeof loginSchema>;

const initialValues = ref<Schema>({
  email: "",
  password: "",
});

const resolver = ref(zodResolver(loginSchema));

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid || isSubmitting.value) {
    return;
  }

  isSubmitting.value = true;
  userStore.clearUser();

  try {
    const response = await login(values as Schema);
    userStore.setUser(response.user);

    toast.add({
      severity: "success",
      summary: "Login successful",
    });

    await router.push(APP_LINKS.DASHBOARD);
  } catch (error) {
    const code = error instanceof ApiError ? error.status : 500;

    if (code === 422) {
      toast.add({
        severity: "error",
        summary: "Invalid credentials",
        detail: "Email or password is incorrect.",
      });
      return;
    }

    toast.add({
      severity: "error",
      summary: "Login failed",
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
      <FormInputField name="email" type="text" placeholder="Email" />
      <FormInputField name="password" type="password" placeholder="Password" />
      <Button
        :loading="isSubmitting"
        type="submit"
        size="small"
        outlined
        label="Submit"
      />
    </Form>

    <Footer
      info="Don't have an account?"
      :href="GUEST_LINKS.SIGN_UP"
      text="Sign up"
    />
  </div>
</template>

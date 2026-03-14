<script setup lang="ts">
import { ref } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Toast from "primevue/toast";
import { Form } from "@primevue/forms";
import FormField from "@primevue/forms/formfield";
import { loginSchema } from "@/schema";

const toast = useToast();

const initialValues = ref<z.infer<typeof loginSchema>>({
  email: "",
  password: "",
});

const resolver = ref(zodResolver(loginSchema));

const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    toast.add({
      severity: "success",
      summary: "Form is submitted.",
    });
  }
};
</script>

<template>
  <div class="card flex flex-col items-center gap-5">
    <Form
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full mt-4"
    >
      <FormField v-slot="$field" name="email" class="flex flex-col gap-1">
        <InputText
          type="email"
          size="small"
          placeholder="Email"
          v-bind="$field.props"
        />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $field.error?.message }}
        </Message>
      </FormField>
      <FormField v-slot="$field" name="password" class="flex flex-col gap-1">
        <InputText
          type="password"
          placeholder="Password"
          size="small"
          v-bind="$field.props"
        />
        <Message
          v-if="$field?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $field.error?.message }}
        </Message>
      </FormField>

      <Button type="submit" size="small" outlined label="Submit" />
    </Form>
  </div>
</template>

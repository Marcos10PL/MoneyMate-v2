<script setup lang="ts">
import FormField from "@primevue/forms/formfield";
import { Password } from "primevue";
import InputText from "primevue/inputtext";
import Message from "primevue/message";

const { type = "text", size = "small" } = defineProps<{
  name: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  size?: "small" | "large";
  disabled?: boolean;
}>();
</script>

<template>
  <FormField v-slot="$field" :name="name" class="flex flex-col gap-1">
    <InputText
      :type="type"
      :size="size"
      :placeholder="placeholder"
      v-bind="$field.props"
      :disabled="disabled"
    />
    <Message
      v-if="$field?.invalid"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ $field.error?.message }}
    </Message>
  </FormField>
</template>

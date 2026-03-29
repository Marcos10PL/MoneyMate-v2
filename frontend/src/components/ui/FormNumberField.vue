<script setup lang="ts">
import FormField from "@primevue/forms/formfield";
import { InputNumber, Message } from "primevue";

defineProps<{
  name: string;
  placeholder?: string;
  size?: "small" | "large";
  minFractionDigits?: number;
  maxFractionDigits?: number;
}>();
</script>

<template>
  <FormField v-slot="$field" :name="name" class="flex flex-col gap-1">
    <InputNumber
      v-bind="$field.props"
      :placeholder="placeholder"
      :size="size ?? 'small'"
      :minFractionDigits="minFractionDigits"
      :maxFractionDigits="maxFractionDigits"
      :pt="{ pcInputText: { root: { autocomplete: 'off' } } }"
      class="w-full"
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

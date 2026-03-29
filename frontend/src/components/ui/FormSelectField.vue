<script setup lang="ts">
import FormField from "@primevue/forms/formfield";
import { Message, Select } from "primevue";

type SelectOption = Record<string, unknown>;

defineProps<{
  name: string;
  options: SelectOption[];
  optionLabel: string;
  optionValue: string;
  placeholder?: string;
  size?: "small" | "large";
}>();
</script>

<template>
  <FormField v-slot="$field" :name="name" class="flex flex-col gap-1">
    <Select
      v-bind="$field.props"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :size="size ?? 'small'"
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

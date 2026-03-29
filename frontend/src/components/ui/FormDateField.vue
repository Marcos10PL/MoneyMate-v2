<script setup lang="ts">
import FormField from "@primevue/forms/formfield";
import { DatePicker, Message } from "primevue";

defineProps<{
  name: string;
  placeholder?: string;
  size?: "small" | "large";
}>();
</script>

<template>
  <FormField v-slot="$field" :name="name" class="flex flex-col gap-1">
    <DatePicker
      v-bind="$field.props"
      :modelValue="$field.value"
      :placeholder="placeholder"
      :size="size ?? 'small'"
      showIcon
      dateFormat="dd.mm.yy"
      iconDisplay="input"
      :showOnFocus="false"
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

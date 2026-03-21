<script setup lang="ts">
import { Button, Dialog } from "primevue";

const model = defineModel<boolean>();

const { action } = defineProps<{
  action: () => Promise<void>;
  loading: boolean;
  confirmLabel: string;
  description?: string;
  title?: string;
}>();

const onConfirm = async () => {
  await action();
  model.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="model"
    modal
    :header="title"
    :style="{ width: '25rem' }"
  >
    <slot>
      <p v-if="description" class="text-sm">
        {{ description }}
      </p>
    </slot>

    <div class="flex justify-end gap-2 mt-4">
      <Button
        label="Cancel"
        outlined
        variant=""
        size="small"
        severity="contrast"
        @click="model = false"
      />
      <Button
        :label="confirmLabel"
        severity="danger"
        size="small"
        :loading="loading"
        @click="onConfirm"
      />
    </div>
  </Dialog>
</template>

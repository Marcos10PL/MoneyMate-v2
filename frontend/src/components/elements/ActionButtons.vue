<script setup lang="ts">
import { Button } from 'primevue'

</script>

<template>
  <div class="flex items-center">
    <Button
      icon="pi pi-pencil"
      variant="text"
      size="small"
      severity="info"
      v-tooltip.bottom="'Edit'"
      @click="$emit('edit')"
    />
    <Button
      icon="pi pi-trash"
      variant="text"
      size="small"
      severity="danger"
      v-tooltip.bottom="'Delete'"
      @click="$emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { categorySchema } from "@/schema";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button, useToast } from "primevue";
import { ref } from "vue";
import type z from "zod";
import FormInputField from "../ui/FormInputField.vue";
import type { Category } from "@/types";
import { useCategoriesStore } from "@/store/categories";

const toast = useToast();
const categoriesStore = useCategoriesStore();

type Props =
  | {
      isUpdating?: false;
      category?: never;
    }
  | {
      isUpdating: true;
      category: Category;
    };

const { isUpdating, category } = defineProps<Props>();

const emits = defineEmits(["success"]);

type Schema = z.infer<typeof categorySchema>;

const initialValues = ref<Schema>({
  name: isUpdating ? category.name : "",
  is_global: false,
});

const resolver = ref(zodResolver(categorySchema));

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (!valid) {
    return;
  }

  try {
    if (isUpdating) {
      await categoriesStore.updateCategory(category.id, values as Schema);
    } else {
      await categoriesStore.createCategory(values as Schema);
    }

    toast.add({
      severity: "success",
      summary: isUpdating
        ? "Category updated successfully"
        : "Category created successfully",
    });

    emits("success");
  } catch (error) {
    const code = error instanceof Error ? (error as any).status : 500;

    if (code === 422) {
      toast.add({
        severity: "error",
        summary: isUpdating
          ? "Failed to update category"
          : "Failed to create category",
        detail: "A category with the same name already exists.",
      });
    } else {
      toast.add({
        severity: "error",
        summary: isUpdating
          ? "Failed to update category"
          : "Failed to create category",
      });
    }
  }
};
</script>

<template>
  <div class="card flex flex-col items-center gap-5">
    <Form
      :initialValues="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full mt-4"
    >
      <FormInputField name="name" type="text" placeholder="Name" />
      <Button
        type="submit"
        size="small"
        outlined
        :label="isUpdating ? 'Update category' : 'Create category'"
        :loading="isUpdating ? categoriesStore.isUpdating : categoriesStore.isCreating"
      />
    </Form>
  </div>
</template>

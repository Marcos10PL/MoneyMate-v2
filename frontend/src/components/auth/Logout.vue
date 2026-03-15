<script setup lang="ts">
import { GUEST_LINKS } from "@/const";
import { logout } from "@/services/api";
import { useUserStore } from "@/store/user";
import { Button } from "primevue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const loading = ref(false);

async function handleLogout() {
  loading.value = true;

  try {
    await logout();
  } finally {
    userStore.clearUser();
    router.push(GUEST_LINKS.SIGN_IN);
    loading.value = false;
  }
}
</script>

<template>
  <Button
    icon="pi pi-sign-out"
    rounded
    :loading
    size="small"
    severity="secondary"
    v-tooltip.bottom="'Logout'"
    @click="handleLogout"
  />
</template>

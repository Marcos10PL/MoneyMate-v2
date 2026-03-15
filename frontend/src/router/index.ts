import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "guest",
      meta: { guestOnly: true },
      component: () => import("../layouts/GuestLayout.vue"),
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/HomeView.vue"),
        },
        {
          path: "sign-in",
          name: "sign-in",
          component: () => import("../views/SignInView.vue"),
        },
        {
          path: "sign-up",
          name: "sign-up",
          component: () => import("../views/SignUpView.vue"),
        },
      ],
    },
    {
      path: "/app",
      name: "app",
      meta: { requiresAuth: true },
      redirect: { name: "dashboard" },
      component: () => import("../layouts/AppLayout.vue"),
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("../views/DashboardView.vue"),
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../views/ProfileView.vue"),
        },
        {
          path: "transactions",
          name: "transactions",
          component: () => import("../views/TransactionsView.vue"),
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../views/SettingsView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach(async to => {
  const userStore = useUserStore();

  if (!userStore.isSessionInitialized) {
    await userStore.initSession();
  }

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const guestOnly = Boolean(to.meta.guestOnly);

  if (requiresAuth && !userStore.isAuthenticated()) {
    return { name: "sign-in" };
  }

  if (guestOnly && userStore.isAuthenticated()) {
    return { name: "dashboard" };
  }
});

export default router;

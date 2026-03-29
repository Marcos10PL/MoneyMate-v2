import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
import { useAccountsStore } from "@/store/accounts";
import { useCategoriesStore } from "@/store/categories";
import { useTransactionTypesStore } from "@/store/transactionTypes";
import { useInitStore } from "@/store/init";
import { SETTINGS_TABS } from "@/const";

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
          beforeEnter: (to, from, next) => {
            const params = new URLSearchParams(
              to.query as Record<string, string>,
            );
            const tab = params.get("tab");

            if (
              tab === SETTINGS_TABS.ACCOUNTS.value ||
              tab === SETTINGS_TABS.CATEGORIES.value
            ) {
              next();
            } else {
              next({
                name: "settings",
                query: { tab: SETTINGS_TABS.CATEGORIES.value },
              });
            }
          },
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
  const init = useInitStore();

  const userStore = useUserStore();
  const accountsStore = useAccountsStore();
  const categoriesStore = useCategoriesStore();
  const typesStore = useTransactionTypesStore();

  if (!userStore.isSessionInitialized) {
    await userStore.initSession();
  }

  if (
    userStore.isAuthenticated() &&
    !accountsStore.isInitialLoaded &&
    !categoriesStore.isInitialLoaded
  ) {
    await Promise.all([
      accountsStore.fetchAccounts(),
      categoriesStore.fetchCategories(),
      typesStore.fetchTypes(),
    ]);
  }
  
  init.loading = false;

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

export const GUEST_LINKS = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const;

export const APP_LINKS = {
  DASHBOARD: "/app/dashboard",
  TRANSACTIONS: "/app/transactions",
  SETTINGS: "/app/settings",
  PROFILE: "/app/profile",
} as const;

export const APP_LINKS_ICONS: Record<keyof typeof APP_LINKS, string> = {
  DASHBOARD: "pi pi-home",
  TRANSACTIONS: "pi pi-wallet",
  PROFILE: "pi pi-user",
  SETTINGS: "pi pi-cog",
} as const;

export const SETTINGS_TABS = {
  CATEGORIES: { label: "Categories", value: "categories" },
  ACCOUNTS: { label: "Accounts", value: "accounts" },
} as const;

export const SUMMARY_COLORS = {
  INCOME: "text-green-500",
  EXPENSE: "text-red-500",
  BALANCE: "text-primary",
} as const;

export const SUMMARY_ICONS = {
  INCOME: "pi pi-arrow-up",
  EXPENSE: "pi pi-arrow-down",
  BALANCE: APP_LINKS_ICONS.TRANSACTIONS,
} as const;

export const DEFAULT_TOAST_LIFE_MS = 3000; // 3s

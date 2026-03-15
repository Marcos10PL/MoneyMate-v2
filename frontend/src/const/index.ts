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

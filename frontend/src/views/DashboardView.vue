<script setup lang="ts">
import { computed } from "vue";
import { useAccountsStore } from "@/store/accounts";
import Chart from "primevue/chart";
import { formatPrice } from "@/utils";
import { SUMMARY_COLORS, SUMMARY_ICONS } from "@/const";
import Container from "@/components/ui/Container.vue";

const accountsStore = useAccountsStore();

const accounts = computed(() => accountsStore.accounts);

const totalIncome = computed(() =>
  accounts.value.reduce((sum, a) => sum + a.income_sum, 0),
);
const totalExpense = computed(() =>
  accounts.value.reduce((sum, a) => sum + a.expense_sum, 0),
);
const totalBalance = computed(() =>
  accounts.value.reduce((sum, a) => sum + a.balance, 0),
);

const summaryCards = computed(() => [
  {
    label: "Przychody",
    value: totalIncome.value,
    icon: SUMMARY_ICONS.INCOME,
    color: SUMMARY_COLORS.INCOME,
    bg: "bg-green-500/10",
  },
  {
    label: "Wydatki",
    value: totalExpense.value,
    icon: SUMMARY_ICONS.EXPENSE,
    color: SUMMARY_COLORS.EXPENSE,
    bg: "bg-red-500/10",
  },
  {
    label: "Bilans",
    value: totalBalance.value,
    icon: SUMMARY_ICONS.BALANCE,
    color: SUMMARY_COLORS.BALANCE,
    bg: "bg-primary/10",
  },
]);

const barData = computed(() => ({
  labels: accounts.value.map(a => a.name),
  datasets: [
    {
      label: "Przychody",
      data: accounts.value.map(a => a.income_sum),
      backgroundColor: "#22c55e",
      borderRadius: 6,
    },
    {
      label: "Wydatki",
      data: accounts.value.map(a => a.expense_sum),
      backgroundColor: "#ef4444",
      borderRadius: 6,
    },
  ],
}));

const barOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    tooltip: {
      callbacks: {
        label: (ctx: any) =>
          `${ctx.dataset.label}: ${formatPrice(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      ticks: {
        callback: (val: number) => formatPrice(val),
      },
    },
  },
}));

const donutData = computed(() => ({
  labels: accounts.value.map(a => a.name),
  datasets: [
    {
      data: accounts.value.map(a => Math.max(a.balance, 0)),
      backgroundColor: [
        "#f59e0b",
        "#3b82f6",
        "#8b5cf6",
        "#10b981",
        "#f43f5e",
        "#06b6d4",
      ],
      hoverOffset: 6,
    },
  ],
}));

const donutOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { position: "bottom" },
    tooltip: {
      callbacks: {
        label: (ctx: any) =>
          `${ctx.label}: ${formatPrice(ctx.parsed)}`,
      },
    },
  },
}));
</script>

<template>
  <Container class="space-y-6">
    <h1 class="text-xl font-bold">Dashboard</h1>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="border dark:border-zinc-700 border-zinc-200 rounded-lg p-4 dark:bg-zinc-900 bg-zinc-50 flex items-center gap-4"
      >
        <div :class="['rounded-full p-3', card.bg]">
          <i :class="[card.icon, card.color, 'text-xl']" />
        </div>
        <div>
          <p class="text-sm text-gray-500">{{ card.label }}</p>
          <p :class="['text-lg font-bold', card.color]">
            {{ formatPrice(card.value) }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="accounts.length === 0"
      class="text-center text-gray-400 py-16 text-sm"
    >
      Brak kont — dodaj konto, żeby zobaczyć wykresy.
    </div>

    <template v-else>
      <!-- Bar chart -->
      <div
        class="border dark:border-zinc-700 border-zinc-200 rounded-lg p-4 dark:bg-zinc-900 bg-zinc-50"
      >
        <h2 class="font-semibold mb-4 text-sm">
          Przychody vs Wydatki per konto
        </h2>
        <div class="h-64">
          <Chart type="bar" :data="barData" :options="barOptions" class="h-full" />
        </div>
      </div>

      <!-- Donut -->
      <div
        class="border dark:border-zinc-700 border-zinc-200 rounded-lg p-4 dark:bg-zinc-900 bg-zinc-50"
      >
        <h2 class="font-semibold mb-4 text-sm">
          Podział bilansu między kontami
        </h2>
        <div class="h-72">
          <Chart type="doughnut" :data="donutData" :options="donutOptions" class="h-full" />
        </div>
      </div>
    </template>
  </Container>
</template>

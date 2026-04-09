export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    currencyDisplay: "narrowSymbol",
    currencySign: "standard",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    useGrouping: true,
  }).format(price);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

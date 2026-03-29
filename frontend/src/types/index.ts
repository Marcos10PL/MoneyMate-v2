// ------- PAYLOAD TYPES --------

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type AccountPayload = {
  name: string;
};

export type CategoryPayload = {
  name: string;
  is_global?: boolean;
};

export type TransactionPayload = {
  name: string;
  amount: number;
  type_id: number;
  category_id: number;
  account_id?: number | null;
  date?: string | Date;
};

// ------ PARAMS TYPES --------

export type PaginationParams = {
  page?: number;
  perPage?: number;
};

export type SortBy = "asc" | "desc" | undefined;

export type TransactionFilters = {
  categoryId?: number;
  typeId?: number;
  accountId?: number;
  startDate?: Date;
  endDate?: Date;
};

export type TransactionQueryParams = TransactionFilters &
  PaginationParams & {
    sortBy?: SortBy;
    search?: string;
  };

// ------ DATA TYPES --------

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export type Account = {
  id: number;
  name: string;
};

export type AccountSummary = {
  id: number;
  name: string;
} & Summary;

export type Category = {
  id: number;
  name: string;
  is_global: boolean;
};

export type TransactionType = {
  id: number;
  name: string;
};

export enum TransactionTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
}

export type Transaction = {
  id: number;
  name: string;
  amount: string;
  type: TransactionTypeEnum;
  category: string;
  account: string | null;
  account_id: number | null;
  date: string;
};

export type TransactionsData = {
  transactions: Transaction[];
} & Summary;

// ------ COMMON TYPES --------

export type Summary = {
  income_sum: number;
  expense_sum: number;
  balance: number;
};

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
};

// ------- API RESPONSE TYPES --------

export type TransactionsListResponse = {
  data: TransactionsData;
  meta: PaginationMeta;
};

export type ApiErrorResponse = {
  message?: string;
  errors?: ApiValidationErrors;
};

export type ApiResponse<T = undefined, K extends string = "data"> = {
  message: string;
} & ([T] extends [undefined] ? {} : Record<K, T>);

// ---- OTHER TYPES ----

export type ApiValidationErrors = Record<string, string[]>;

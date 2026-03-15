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

// ------ PARAMS TYPES --------

export type PaginationParams = {
  page?: number;
  perPage?: number;
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
  income_sum: number;
  expense_sum: number;
  balance: number;
};

export type Category = {
  id: number;
  name: string;
  is_global: boolean;
};

// ------- API RESPONSE TYPES --------

export type ApiErrorResponse = {
  message?: string;
  errors?: ApiValidationErrors;
};

export type ApiResponse<T = undefined, K extends string = "data"> = {
  message: string;
} & ([T] extends [undefined] ? {} : Record<K, T>);

// export type LoginResponse = {
//   message: string;
//   user: AuthUser;
// };

// export type RegisterResponse = {
//   message: string;
//   user: AuthUser;
// };

// ---- OTHER TYPES ----

export type ApiValidationErrors = Record<string, string[]>;

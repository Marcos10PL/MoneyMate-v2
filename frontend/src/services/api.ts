import { toApiError } from "./errors";
import type {
  Account,
  AccountPayload,
  AccountSummary,
  ApiResponse,
  AuthUser,
  Category,
  CategoryPayload,
  LoginPayload,
  RegisterPayload,
  Transaction,
  TransactionPayload,
  TransactionQueryParams,
  TransactionsListResponse,
} from "@/types";
import { api, APP_BASE_URL } from "./conn";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// -------- AUTH --------
export async function getCsrfCookie() {
  try {
    await axios.get(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    throw toApiError(error, "Unable to initialize CSRF protection");
  }
}

export async function login(payload: LoginPayload) {
  try {
    await getCsrfCookie();
    const { data } = await api.post<ApiResponse<AuthUser, "user">>(
      "/auth/login",
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Login failed");
  }
}

export async function register(payload: RegisterPayload) {
  try {
    await getCsrfCookie();
    const { data } = await api.post<ApiResponse<AuthUser, "user">>(
      "/auth/register",
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Registration failed");
  }
}

export async function logout() {
  try {
    const { data } = await api.post("/auth/logout");
    return data;
  } catch (error) {
    throw toApiError(error, "Logout failed");
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get<AuthUser>("/user");
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to fetch current user");
  }
}

export async function deleteUser() {
  try {
    const { data } = await api.delete("/auth/delete");
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to delete user");
  }
}

// -------- ACCOUNTS --------
export async function getAccounts() {
  try {
    const { data } =
      await api.get<ApiResponse<AccountSummary[], "accounts">>("/accounts");
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to fetch accounts");
  }
}

export async function createAccount(payload: AccountPayload) {
  try {
    const { data } = await api.post<ApiResponse<Account, "account">>(
      "/accounts",
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to create account");
  }
}

export async function updateAccount(id: number, payload: AccountPayload) {
  try {
    const { data } = await api.put<ApiResponse<Account, "account">>(
      `/accounts/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to update account");
  }
}

export async function deleteAccount(id: number) {
  try {
    const { data } = await api.delete<ApiResponse>(`/accounts/${id}`);
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to delete account");
  }
}

// -------- CATEGORIES --------
export async function getCategories() {
  try {
    const { data } =
      await api.get<ApiResponse<Category[], "categories">>("/categories");
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to fetch categories");
  }
}

export async function createCategory(payload: CategoryPayload) {
  try {
    const { data } = await api.post<ApiResponse<Category, "category">>(
      "/categories",
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to create category");
  }
}

export async function updateCategory(id: number, payload: CategoryPayload) {
  try {
    const { data } = await api.put<ApiResponse<Category, "category">>(
      `/categories/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to update category");
  }
}

export async function deleteCategory(id: number) {
  try {
    const { data } = await api.delete<ApiResponse>(`/categories/${id}`);
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to delete category");
  }
}

// -------- TRANSACTIONS --------

function toTransactionQueryParams(params?: TransactionQueryParams) {
  if (!params) {
    return undefined;
  }

  return {
    category_id: params.categoryId,
    type_id: params.typeId,
    account_id: params.accountId,
    start_date: params.startDate,
    end_date: params.endDate,
    search: params.search,
    sort_by: params.sortBy,
    page: params.page,
    per_page: params.perPage,
  };
}

export async function getTransactions(params?: TransactionQueryParams) {
  try {
    const { data } = await api.get<TransactionsListResponse>("/transactions", {
      params: toTransactionQueryParams(params),
    });
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to fetch transactions");
  }
}

export async function getTransaction(id: number) {
  try {
    const { data } = await api.get<ApiResponse<Transaction, "data">>(
      `/transactions/${id}`,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to fetch transaction");
  }
}

export async function createTransaction(payload: TransactionPayload) {
  try {
    const { data } = await api.post<ApiResponse<Transaction, "transaction">>(
      "/transactions",
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to create transaction");
  }
}

export async function updateTransaction(
  id: number,
  payload: TransactionPayload,
) {
  try {
    const { data } = await api.put<ApiResponse<Transaction, "transaction">>(
      `/transactions/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to update transaction");
  }
}

export async function deleteTransaction(id: number) {
  try {
    const { data } = await api.delete<ApiResponse>(`/transactions/${id}`);
    return data;
  } catch (error) {
    throw toApiError(error, "Unable to delete transaction");
  }
}

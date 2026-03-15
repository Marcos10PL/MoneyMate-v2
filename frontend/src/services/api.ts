import { toApiError } from "./errors";
import type {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types";
import { api, APP_BASE_URL } from "./conn";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.xsrfCookieName = "XSRF-TOKEN";
axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

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
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  } catch (error) {
    throw toApiError(error, "Login failed");
  }
}

export async function register(payload: RegisterPayload) {
  try {
    await getCsrfCookie();
    const { data } = await api.post<RegisterResponse>(
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

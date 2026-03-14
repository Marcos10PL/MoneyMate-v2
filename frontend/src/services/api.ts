import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
const APP_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export async function getCsrfCookie() {
  await axios.get(`${APP_BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

export async function login(payload: LoginPayload) {
  await getCsrfCookie();
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function logout() {
  const { data } = await api.post<{ message: string }>("/auth/logout");
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<AuthUser>("/user");
  return data;
}

export type ApiValidationErrors = Record<string, string[]>;

export type ApiErrorResponse = {
  message?: string;
  errors?: ApiValidationErrors;
};

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

export type RegisterResponse = {
  message: string;
  user: AuthUser;
};

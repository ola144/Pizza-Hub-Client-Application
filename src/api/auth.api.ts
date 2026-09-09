import api from "./axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);

  return data;
};

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);

  return data;
};

export const adminLoginApi = async (payload: LoginPayload) => {
  const { data } = await api.post<AuthResponse>("/admin/login", payload);

  return data;
};

export const getMeApi = async () => {
  if (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/admin/login"
  ) {
    const { data } = await api.get<AuthResponse>("/auth/me");

    return data;
  }
};

export const logoutApi = async () => {
  const { data } = await api.post<AuthResponse>("/auth/logout");

  return data;
};

export const forgotPasswordApi = async (email: string) => {
  const { data } = await api.post<AuthResponse>("/auth/forgot-password", {
    email,
  });

  return data;
};

export const resetPasswordApi = async (token: string, password: string) => {
  const { data } = await api.post<AuthResponse>(
    `/auth/reset-password/${token}`,
    { password },
  );

  return data;
};

export const verifyEmailApi = async (token: string) => {
  const { data } = await api.get<AuthResponse>(`/auth/verify-email/${token}`);

  return data;
};

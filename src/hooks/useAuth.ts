import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  registerApi,
  loginApi,
  adminLoginApi,
  getMeApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  verifyEmailApi,
  type RegisterPayload,
  type LoginPayload,
} from "../api/auth.api";

export const AUTH_QUERY_KEY = ["auth", "me"];

export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: getMeApi,
    retry: false,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, data);
      }
    },
  });
};

export const useAdminLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => adminLoginApi(payload),

    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(AUTH_QUERY_KEY, data);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);

      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPasswordApi(token, password),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmailApi(token),
  });
};

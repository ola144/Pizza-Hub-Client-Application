import api from "./axios";

interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  ordersCount: number;
  totalSpent: number;
}

export type AdminUser = IUser;

export interface AdminUsersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  users: AdminUser[];
}

export const getAdminUsersApi = async (page = 1, limit = 10) => {
  const { data } = await api.get<AdminUsersResponse>("/admin/users", {
    params: { page, limit },
  });
  return data;
};

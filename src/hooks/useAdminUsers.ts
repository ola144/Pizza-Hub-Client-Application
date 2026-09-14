import { useQuery } from "@tanstack/react-query";
import { getAdminUsersApi } from "../api/user.api";

export const useAdminUsers = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["users", "all", page, limit],
    queryFn: () => getAdminUsersApi(page, limit),
  });

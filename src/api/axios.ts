import axios from "axios";
import { useCurrentUser } from "../hooks/useAuth";

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      sessionStorage.setItem(
        "sessionExpired",
        "Your session has expired. Please login again.",
      );

      let userData;

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/admin/login"
      ) {
        const { data: user } = useCurrentUser();

        userData = user?.user;
      }

      if (userData?.role === "admin") {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }
  },
);

export default api;

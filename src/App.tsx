import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLoginPage = lazy(() => import("./pages/auth/AdminLoginPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const InventoryPage = lazy(() => import("./pages/admin/InventoryPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminOrderDetailsPage = lazy(
  () => import("./pages/admin/AdminOrderDetailsPage"),
);
const UserLayout = lazy(() => import("./layouts/UserLayout"));
const UserDashboardPage = lazy(() => import("./pages/user/UserDashboardPage"));
const IngredientsPage = lazy(() => import("./pages/user/IngredientsPage"));
const CreateOrderPage = lazy(() => import("./pages/user/CreateOrderPage"));
const OrdersPage = lazy(() => import("./pages/user/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/user/OrderDetailsPage"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
        </Route>
        <Route path="/ingredients" element={<UserLayout />}>
          <Route index element={<IngredientsPage />} />
        </Route>
        <Route path="/order/new" element={<UserLayout />}>
          <Route index element={<CreateOrderPage />} />
        </Route>

        <Route path="/orders" element={<UserLayout />}>
          <Route index element={<OrdersPage />} />
          <Route path=":orderId" element={<OrderDetailsPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

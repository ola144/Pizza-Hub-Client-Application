import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminLoginPage } from "./pages/auth/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { InventoryPage } from "./pages/admin/InventoryPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminOrderDetailsPage } from "./pages/admin/AdminOrderDetailsPage";
import { UserLayout } from "./layouts/UserLayout";
import { UserDashboardPage } from "./pages/user/UserDashboardPage";
import { IngredientsPage } from "./pages/user/IngredientsPage";
import { CreateOrderPage } from "./pages/user/CreateOrderPage";
import { OrdersPage } from "./pages/user/OrdersPage";
import { OrderDetailsPage } from "./pages/user/OrderDetailsPage";

function App() {
  return (
    <BrowserRouter>
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
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

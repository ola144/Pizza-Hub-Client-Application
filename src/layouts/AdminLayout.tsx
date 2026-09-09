import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import {
  AdminMobileMenuButton,
  AdminSidebar,
} from "../components/admin/AdminSidebar";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = useCurrentUser();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutateAsync();

    navigate("/admin/login");
  };

  if (currentUser.isLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#fffaf5] text-sm text-[#765f54]">
        Loading your workspace...
      </div>
    );
  if (!currentUser.data?.user || currentUser.data.user.role !== "admin")
    return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return (
    <div className="h-screen lg:overflow-hidden bg-[#f8f4f0] lg:flex">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={logout.isPending}
      />
      <div className="min-w-0 flex-1 overflow-y-auto lg:ml-72">
        <header className="lg:sticky fixed w-full top-0 z-20 flex h-20 items-center justify-between border-b border-[#eadfd8] bg-[#fffaf5] px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <AdminMobileMenuButton onClick={() => setSidebarOpen(true)} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e85d04]">
                Admin workspace
              </p>
              <p className="mt-1 text-sm font-semibold text-[#765f54]">
                Good to see you, {currentUser.data.user.name}
              </p>
            </div>
          </div>
          <div className="grid size-10 place-items-center rounded-full bg-[#f9b44d]/30 text-sm font-bold text-[#8e4a13]">
            {currentUser.data.user.name.slice(0, 1).toUpperCase()}
          </div>
        </header>
        <main className="mx-auto w-full max-w-375 p-5 sm:p-8 lg:p-10 mt-20 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import {
  UserMobileMenuButton,
  UserSidebar,
} from "../components/user/UserSidebar";

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = useCurrentUser();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutateAsync();

    navigate("/login");
  };

  if (user.isLoading)
    return (
      <div className="grid min-h-screen place-items-center bg-[#fffaf5] text-sm text-[#765f54]">
        Loading your PizzaHub...
      </div>
    );
  if (!user.data?.user || user.data.user.role !== "user")
    return <Navigate to="/login" state={{ from: location }} replace />;
  return (
    <div className="h-screen lg:overflow-hidden bg-[#f8f4f0] lg:flex">
      <UserSidebar
        open={open}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={logout.isPending}
      />
      <div className="min-w-0 flex-1 overflow-y-auto lg:ml-72">
        <header className="lg:sticky fixed w-full top-0 z-20 flex h-20 items-center justify-between border-b border-[#eadfd8] bg-[#fffaf5] px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <UserMobileMenuButton onClick={() => setOpen(true)} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e85d04]">
                PizzaHub
              </p>
              <p className="mt-1 text-sm font-semibold text-[#765f54]">
                Welcome back, {user.data.user.name}
              </p>
            </div>
          </div>
          <div className="grid size-10 place-items-center rounded-full bg-[#f9b44d]/30 text-sm font-bold text-[#8e4a13]">
            {user.data.user.name.slice(0, 1).toUpperCase()}
          </div>
        </header>
        <main className="mx-auto w-full max-w-375 p-5 sm:p-8 lg:p-10 mt-20 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;

import {
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Pizza,
  ShoppingBag,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const navigation = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Inventory", to: "/admin/inventory", icon: PackageSearch },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
];

export function AdminSidebar({
  open,
  onClose,
  onLogout,
  isLoggingOut,
}: AdminSidebarProps) {
  return (
    <>
      <button
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[#2b1b14]/45 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex min-h-screen w-72 flex-col bg-[#2b1b14] px-5 py-6 text-[#fffaf5] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-3 text-lg font-bold tracking-tight"
            onClick={onClose}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#f47721] text-white">
              <Pizza size={22} strokeWidth={2.5} />
            </span>
            Pizza<span className="text-[#f9b44d]">Hub</span>
          </NavLink>
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-2 text-[#d5bfb3] hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-12 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a98c7e]">
          Workspace
        </div>
        <nav className="mt-3 space-y-1" aria-label="Admin navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-[#f47721] text-white shadow-lg shadow-black/10" : "text-[#d5bfb3] hover:bg-white/10 hover:text-white"}`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/7 p-4">
          <p className="text-xs font-semibold text-[#f9b44d]">
            Kitchen operations
          </p>
          <p className="mt-2 text-xs leading-5 text-[#c7afa1]">
            Keep stock levels healthy and orders moving.
          </p>
        </div>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#d5bfb3] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <LogOut size={19} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </aside>
    </>
  );
}

export function AdminMobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Open navigation"
      onClick={onClick}
      className="rounded-xl border border-[#eadfd8] bg-white p-2.5 text-[#2b1b14] shadow-sm lg:hidden"
    >
      <Menu size={20} />
    </button>
  );
}

import {
  Home,
  LogOut,
  Menu,
  Package,
  Pizza,
  ShoppingBag,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface UserSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  isLoggingOut?: boolean;
}
const links = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Build a pizza", to: "/order/new", icon: Pizza },
  { label: "My orders", to: "/orders", icon: ShoppingBag },
  { label: "Ingredients", to: "/ingredients", icon: Package },
];

export function UserSidebar({
  open,
  onClose,
  onLogout,
  isLoggingOut,
}: UserSidebarProps) {
  return (
    <>
      <button
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-[#2b1b14]/45 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col bg-[#2b1b14] px-5 py-6 text-[#fffaf5] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 text-lg font-bold tracking-tight"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#f47721] text-white">
              <Pizza size={22} />
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
        <p className="mt-12 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a98c7e]">
          Your PizzaHub
        </p>
        <nav className="mt-3 space-y-1">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-[#f47721] text-white shadow-lg" : "text-[#d5bfb3] hover:bg-white/10 hover:text-white"}`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/7 p-4">
          <p className="text-xs font-semibold text-[#f9b44d]">
            Dinner, sorted.
          </p>
          <p className="mt-2 text-xs leading-5 text-[#c7afa1]">
            Pick your favorites and make a pizza that is unmistakably yours.
          </p>
        </div>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="mt-5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#d5bfb3] hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <LogOut size={19} />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </aside>
    </>
  );
}

export function UserMobileMenuButton({ onClick }: { onClick: () => void }) {
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

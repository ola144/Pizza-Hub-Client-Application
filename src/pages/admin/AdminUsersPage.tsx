import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CircleUserRound,
  Mail,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import type { AdminUser } from "../../api/user.api";

type UserFilter = "all" | "verified" | "unverified";

const filters: Array<{ value: UserFilter; label: string }> = [
  { value: "all", label: "All users" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Needs verification" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatLastLogin(value: string) {
  if (!value) return "Never signed in";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function UserIdentity({ user }: { user: AdminUser }) {
  return (
    <div className="flex min-w-55 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f9b44d]/30 text-xs font-bold text-[#8e4a13]">
        {initials(user.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#2b1b14]">{user.name}</p>
        <p className="truncate text-xs text-[#a08d82]">{user.email}</p>
      </div>
    </div>
  );
}

function AdminUsersPage() {
  const [filter, setFilter] = useState<UserFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const users = useAdminUsers(page, 10);

  const items = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (users.data?.users ?? []).filter((user) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "verified" && user.isEmailVerified) ||
        (filter === "unverified" && !user.isEmailVerified);
      const matchesSearch =
        !normalizedSearch ||
        `${user.name} ${user.email}`.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, users.data?.users]);

  const loadedUsers = users.data?.users ?? [];
  const verifiedOnPage = loadedUsers.filter(
    (user) => user.isEmailVerified,
  ).length;
  const spendOnPage = loadedUsers.reduce(
    (total, user) => total + user.totalSpent,
    0,
  );

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
            Community
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-[#2b1b14]">
            Users
          </h1>
          <p className="mt-2 text-sm text-[#765f54]">
            Understand the people behind every PizzaHub order.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-xl bg-[#fff0e5] px-4 py-3 text-sm font-bold text-[#e85d04] sm:self-auto">
          <Users size={17} /> {users.data?.total ?? 0} total users
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#765f54]">
              Registered users
            </p>
            <span className="grid size-10 place-items-center rounded-xl bg-[#fff0e5] text-[#e85d04]">
              <CircleUserRound size={19} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#2b1b14]">
            {users.isLoading ? "—" : (users.data?.total ?? 0)}
          </p>
          <p className="mt-2 text-xs text-[#a08d82]">
            Across the PizzaHub community
          </p>
        </div>
        <div className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#765f54]">
              Verified on page
            </p>
            <span className="grid size-10 place-items-center rounded-xl bg-[#e8f7ee] text-[#22864a]">
              <ShieldCheck size={19} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#2b1b14]">
            {users.isLoading ? "—" : verifiedOnPage}
          </p>
          <p className="mt-2 text-xs text-[#a08d82]">
            Of the currently loaded users
          </p>
        </div>
        <div className="rounded-2xl border border-[#eadfd8] bg-[#fffaf5] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#765f54]">
              Spend on page
            </p>
            <span className="grid size-10 place-items-center rounded-xl bg-[#fff7d6] text-[#a56a00]">
              $
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#2b1b14]">
            {users.isLoading ? "—" : `$${spendOnPage.toLocaleString()}.00`}
          </p>
          <p className="mt-2 text-xs text-[#a08d82]">Combined order value</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-[#eadfd8] bg-[#fffaf5] shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#eadfd8] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08d82]"
              size={17}
            />
            <input
              aria-label="Search users"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="w-full rounded-xl border border-[#eadfd8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-[#e85d04]/10"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#f4ede8] p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setFilter(item.value);
                  setPage(1);
                }}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition ${filter === item.value ? "bg-white text-[#e85d04] shadow-sm" : "text-[#765f54] hover:text-[#2b1b14]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {users.isLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-14 animate-pulse rounded-xl bg-[#f4ede8]"
              />
            ))}
          </div>
        ) : users.isError ? (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-[#2b1b14]">
              Users could not load.
            </p>
            <p className="mt-2 text-sm text-[#765f54]">
              Check your connection and try again.
            </p>
            <button
              onClick={() => void users.refetch()}
              className="mt-4 text-sm font-bold text-[#e85d04] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left">
              <thead className="bg-[#fcf8f5] text-xs uppercase tracking-[0.12em] text-[#a08d82]">
                <tr>
                  <th className="px-5 py-4 font-bold">User</th>
                  <th className="px-5 py-4 font-bold">Joined</th>
                  <th className="px-5 py-4 font-bold">Last Seen</th>
                  <th className="px-5 py-4 font-bold">Orders</th>
                  <th className="px-5 py-4 font-bold">Total spent</th>
                  <th className="px-5 py-4 font-bold">Account</th>
                  <th className="px-5 py-4 text-right font-bold">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eadfd8]">
                {items.map((user) => (
                  <tr key={user._id} className="hover:bg-[#fcf8f5]">
                    <td className="px-5 py-4">
                      <UserIdentity user={user} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#765f54]">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#765f54]">
                      {user.lastLogin ? formatDate(user?.lastLogin) : "-"}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#2b1b14]">
                      {user.ordersCount}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#2b1b14]">
                      ${user.totalSpent.toLocaleString()}.00
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.isEmailVerified ? "bg-green-50 text-[#22864a]" : "bg-amber-50 text-amber-700"}`}
                        >
                          {user.isEmailVerified ? "Verified" : "Pending"}
                        </span>
                        <span className="hidden text-xs text-[#a08d82] xl:inline">
                          {formatLastLogin(user.lastLogin)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <a
                        aria-label={`Email ${user.name}`}
                        href={`mailto:${user.email}`}
                        className="inline-flex rounded-lg p-2 text-[#e85d04] hover:bg-[#fff0e5]"
                      >
                        <Mail size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Search className="mx-auto text-[#e85d04]" size={30} />
            <p className="mt-3 text-sm font-bold text-[#2b1b14]">
              No matching users
            </p>
            <p className="mt-1 text-sm text-[#765f54]">
              Try another search or account filter.
            </p>
          </div>
        )}

        {users.data && users.data.pages > 1 ? (
          <div className="flex flex-col gap-4 border-t border-[#eadfd8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-[#765f54]">
              Showing page {users.data.page} of {users.data.pages} ·{" "}
              {users.data.total} users
            </p>
            <div className="flex items-center gap-1">
              <button
                aria-label="Go to previous page"
                disabled={page === 1 || users.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border border-[#eadfd8] px-3 py-2 text-xs font-bold text-[#765f54] hover:bg-[#f4ede8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowLeft size={14} /> Previous
                </span>
              </button>
              <span className="px-2 text-xs font-bold text-[#765f54]">
                {page} / {users.data.pages}
              </span>
              <button
                aria-label="Go to next page"
                disabled={page >= users.data.pages || users.isFetching}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-[#eadfd8] px-3 py-2 text-xs font-bold text-[#765f54] hover:bg-[#f4ede8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="inline-flex items-center gap-1">
                  Next <ArrowRight size={14} />
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AdminUsersPage;

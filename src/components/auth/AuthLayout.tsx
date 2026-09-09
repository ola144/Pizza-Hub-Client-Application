import type { InputHTMLAttributes, ReactNode } from "react";
import { Pizza } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export function AuthLayout({
  children,
  eyebrow,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#fffaf5] lg:grid lg:grid-cols-[minmax(360px,0.86fr)_minmax(560px,1.14fr)]">
      <section className="relative hidden overflow-hidden bg-[#2b1b14] px-12 py-5 text-[#fffaf5] lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border-38 border-[#f47721]/20" />
        <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full border-52 border-[#f9b44d]/10" />
        <Link
          to="/login"
          className="relative flex items-center gap-3 text-lg font-bold tracking-tight"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-[#f47721] text-white shadow-lg shadow-black/20">
            <Pizza size={22} strokeWidth={2.5} />
          </span>
          Pizza<span className="text-[#f9b44d]">Hub</span>
        </Link>
        <div className="relative max-w-md pb-2">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#f9b44d]">
            Made for your cravings
          </p>
          <h2 className="font-display text-3xl leading-[1.05] tracking-[-0.03em] xl:text-4xl">
            Good food is always a good idea.
          </h2>
          <p className="mt-3 max-w-sm text-base leading-7 text-[#ead8cc]">
            Discover hand-tossed favorites, build your perfect slice, and make
            dinner the easiest part of your day.
          </p>
          <div className="mt-5 flex items-center gap-3 text-sm text-[#ead8cc]">
            <span className="h-px w-10 bg-[#f47721]" /> Fresh from our kitchen
          </div>
        </div>
      </section>
      <section className="flex min-h-screen flex-col px-5 py-7 sm:px-10 sm:py-10 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-120 flex-1 flex-col justify-center py-5">
          <div className="mb-8 lg:hidden">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-[#2b1b14]"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-[#f47721] text-white">
                <Pizza size={20} />
              </span>
              Pizza<span className="text-[#e85d04]">Hub</span>
            </Link>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#e85d04]">
              {eyebrow}
            </p>
            <h1 className="font-display text-xl leading-tight tracking-tight text-[#2b1b14]">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#765f54]">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
        <p className="mx-auto w-full max-w-120 text-center text-xs text-[#a08d82]">
          By continuing, you agree to PizzaHub&apos;s Terms and Privacy Policy.
        </p>
      </section>
    </main>
  );
}

export function FormField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#3c2920]">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-2 text-[15px] text-[#2b1b14] outline-none transition placeholder:text-[#b7a69c] focus:border-[#e85d04] focus:ring-4 focus:ring-[#f47721]/10 ${error ? "border-red-400" : "border-[#eadfd8]"}`}
      />
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

export function SubmitButton({
  children,
  loading,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#e85d04] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#e85d04]/20 transition hover:bg-[#c94d00] focus:outline-none focus:ring-4 focus:ring-[#f47721]/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function FormMessage({
  message,
  error,
}: {
  message?: string;
  error?: string;
}) {
  if (!message && !error) return null;
  return (
    <div
      role="alert"
      className={`rounded-xl px-4 py-2 text-sm ${error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
    >
      {error || message}
    </div>
  );
}

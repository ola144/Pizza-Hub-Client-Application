/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthLayout,
  FormField,
  FormMessage,
  SubmitButton,
} from "../../components/auth/AuthLayout";
import { useAdminLogin } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

function AdminLoginPage() {
  const navigate = useNavigate();

  const login = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState<string | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email || !password)
      return setError("Enter your admin email and password.");
    try {
      await login.mutateAsync({ email, password });
      navigate("/admin/dashboard");
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not sign you in.",
      );
    }
  };

  useEffect(() => {
    const sessionExpired = sessionStorage.getItem("sessionExpired");

    if (sessionExpired) {
      setSessionExpiredMsg(sessionExpired);

      setTimeout(() => {
        setSessionExpiredMsg(null);
        sessionStorage.clear();
      }, 5000);
    }
  }, []);

  return (
    <AuthLayout
      eyebrow="PizzaHub operations"
      title="Admin sign in"
      subtitle="Manage your kitchen, inventory, and daily operations from one place."
    >
      <form onSubmit={submit} className="space-y-5">
        <FormMessage error={error} />
        <FormField
          label="Admin email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="absolute top-10 right-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <SubmitButton loading={login.isPending}>Open dashboard</SubmitButton>
        <p className="pt-2 text-center text-sm text-[#765f54]">
          <Link
            to="/login"
            className="font-bold text-[#e85d04] hover:underline"
          >
            Back to customer sign in
          </Link>
        </p>
      </form>

      <div
        className={`bg-red-500 rounded-xl px-4 py-2 text-sm text-white absolute right-2 top-2 transition-all duration-300 ${sessionExpiredMsg ? "opacity-100" : "opacity-0"}`}
      >
        {sessionExpiredMsg}
      </div>
    </AuthLayout>
  );
}

export default AdminLoginPage;

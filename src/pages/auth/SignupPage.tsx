import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AuthLayout,
  FormField,
  FormMessage,
  SubmitButton,
} from "../../components/auth/AuthLayout";
import { useRegister } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

function SignupPage() {
  const navigate = useNavigate();

  const register = useRegister();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!form.name || !form.email || !form.password)
      return setError("Complete all fields to create your account.");

    if (form.password.length < 6)
      return setError("Your password must be at least 6 characters.");

    try {
      const result = await register.mutateAsync(form);

      setMessage(result.message);

      setTimeout(() => navigate("/login"), 1800);
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not create your account.",
      );
    }
  };
  return (
    <AuthLayout
      eyebrow="Join the table"
      title="Create your account"
      subtitle="Save your favorites and get dinner sorted faster."
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <FormMessage error={error} message={message} />
        <FormField
          label="Full name"
          autoComplete="name"
          placeholder="Alex Morgan"
          value={form.name}
          onChange={update("name")}
        />
        <FormField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
        />
        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update("password")}
          />
          <button
            type="button"
            className="absolute top-10 right-2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <SubmitButton loading={register.isPending}>Create account</SubmitButton>
        <p className="pt-2 text-center text-sm text-[#765f54]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#e85d04] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;

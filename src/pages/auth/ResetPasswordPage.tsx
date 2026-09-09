import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AuthLayout,
  FormField,
  FormMessage,
  SubmitButton,
} from "../../components/auth/AuthLayout";
import { useResetPassword } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const resetPassword = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!token) return setError("This reset link is missing its token.");

    if (password.length < 6)
      return setError("Your password must be at least 6 characters.");

    if (password !== confirmPassword)
      return setError("Your passwords do not match.");

    try {
      const result = await resetPassword.mutateAsync({ token, password });

      setMessage(result.message);

      setTimeout(() => navigate("/login"), 1800);
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "This reset link is invalid or expired.",
      );
    }
  };
  return (
    <AuthLayout
      eyebrow="New password"
      title="Choose a new password"
      subtitle="Make it memorable, unique, and at least 6 characters long."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormMessage error={error} message={message} />
        <div className="relative">
          <FormField
            label="New password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
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
        <div className="relative">
          <FormField
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <button
            type="button"
            className="absolute top-10 right-2"
            onClick={() => setShowConfirmPassword(!!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <SubmitButton loading={resetPassword.isPending}>
          Update password
        </SubmitButton>
        <p className="pt-2 text-center text-sm text-[#765f54]">
          <Link
            to="/login"
            className="font-bold text-[#e85d04] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

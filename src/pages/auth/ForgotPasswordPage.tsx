import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AuthLayout,
  FormField,
  FormMessage,
  SubmitButton,
} from "../../components/auth/AuthLayout";
import { useForgotPassword } from "../../hooks/useAuth";

function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email)
      return setError("Enter the email address linked to your account.");

    try {
      const result = await forgotPassword.mutateAsync(email);
      setMessage(result.message);
    } catch (requestError) {
      setError(
        (requestError as { response?: { data?: { message?: string } } })
          .response?.data?.message || "We could not process that request.",
      );
    }
  };
  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter your email and we will send a secure reset link if an account exists."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormMessage error={error} message={message} />
        <FormField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <SubmitButton loading={forgotPassword.isPending}>
          Email reset link
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

export default ForgotPasswordPage;

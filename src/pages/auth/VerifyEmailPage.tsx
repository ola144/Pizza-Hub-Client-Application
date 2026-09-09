import { useEffect, useRef } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useVerifyEmail } from "../../hooks/useAuth";
import { AuthLayout } from "../../components/auth/AuthLayout";

export function VerifyEmailPage() {
  const { token } = useParams();
  const verifyEmail = useVerifyEmail();
  const hasRequested = useRef(false);

  useEffect(() => {
    if (token && !hasRequested.current) {
      hasRequested.current = true;
      verifyEmail.mutate(token);
    }
  }, [token]);

  const failed = verifyEmail.isError;

  const message = failed
    ? (verifyEmail.error as { response?: { data?: { message?: string } } })
        .response?.data?.message ||
      "This verification link is invalid or expired."
    : verifyEmail.data?.message;
  return (
    <AuthLayout
      eyebrow="Email verification"
      title={failed ? "Verification link expired" : "Your email is verified"}
      subtitle={
        failed
          ? "Request a new account invitation or return to sign in to try again."
          : "Your PizzaHub account is ready. Let us find your next favorite slice."
      }
    >
      <div className="text-center">
        <div
          className={`mx-auto mb-6 grid size-20 place-items-center rounded-full ${failed ? "bg-red-50 text-red-500" : verifyEmail.isPending ? "bg-orange-50 text-[#e85d04]" : "bg-green-50 text-green-600"}`}
        >
          {verifyEmail.isPending ? (
            <LoaderCircle className="animate-spin" size={34} />
          ) : failed ? (
            <XCircle size={38} />
          ) : (
            <CheckCircle2 size={38} />
          )}
        </div>
        <p className="text-sm leading-6 text-[#765f54]">
          {verifyEmail.isPending ? "Confirming your email address..." : message}
        </p>
        {!verifyEmail.isPending ? (
          <Link
            to={failed ? "/signup" : "/login"}
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#e85d04] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#c94d00]"
          >
            {failed ? "Create a new account" : "Continue to sign in"}
          </Link>
        ) : null}
      </div>
    </AuthLayout>
  );
}

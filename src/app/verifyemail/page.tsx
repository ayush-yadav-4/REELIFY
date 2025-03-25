"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to resend verification email");
      }

      setCountdown(60);
      setError("");
    } catch (error) {
      setError("Failed to resend verification email");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent a verification link to {session?.user?.email}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="text-center">
          <button
            onClick={handleResendEmail}
            disabled={countdown > 0}
            className="text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
          >
            {countdown > 0
              ? `Resend email in ${countdown}s`
              : "Resend verification email"}
          </button>
        </div>
      </div>
    </div>
  );
} 
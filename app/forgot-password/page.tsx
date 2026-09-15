"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  useForgotPasswordMutation,
  useResendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} from "@/redux/services/authApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (user || accessToken) {
      router.replace("/");
    }
  }, [user, accessToken, router]);

  // Step 1: "email" -> Step 2: "otp" -> Step 3: "newPassword"
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
  const [resendOtp, { isLoading: isResending }] = useResendForgotPasswordOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setFormError("Email address is required.");
      return;
    }

    try {
      const res = await forgotPassword(trimmed).unwrap();
      setSuccessMessage(res?.message || "Verification code sent to your email.");
      setStep("otp");
      setResendTimer(30);
    } catch (err: any) {
      setFormError(err?.data?.message || "Email does not exist. Please check and try again.");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setFormError("");
    try {
      const res = await resendOtp(email.trim().toLowerCase()).unwrap();
      setSuccessMessage(res?.message || "A new verification code has been sent.");
      setResendTimer(30);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to resend verification code.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");
    const trimmedOtp = otp.trim();
    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setFormError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      const res = await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: trimmedOtp,
      }).unwrap();

      setResetToken(res?.resetToken || "");
      setSuccessMessage("Code verified! Please enter your new password.");
      setStep("newPassword");
    } catch (err: any) {
      setFormError(err?.data?.message || "Invalid or expired verification code.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!password) {
      setFormError("Password is required.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        resetToken,
        password,
      }).unwrap();

      setSuccessMessage(res?.message || "Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  if (user || accessToken) {
    return null;
  }

  return (
    <div className="page-content flex min-h-[70vh] items-center justify-center py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-lime-700">
          SFC BAKERS
        </p>

        {step === "email" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1>
            <p className="mt-2 text-slate-500">
              Enter your email and we’ll send a 6-digit verification code.
            </p>
            <form className="mt-7 space-y-4" onSubmit={handleSendEmail}>
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </label>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
              {successMessage && <p className="text-sm text-lime-700">{successMessage}</p>}

              <button
                className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800 disabled:opacity-60 transition"
                type="submit"
                disabled={isSendingEmail}
              >
                {isSendingEmail ? "Sending Code…" : "Send Verification Code"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900">Verify Code</h1>
            <p className="mt-2 text-slate-500">
              Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong>.
            </p>
            <form className="mt-7 space-y-4" onSubmit={handleVerifyOtp}>
              <label className="block text-sm font-semibold text-slate-700">
                6-Digit Verification Code
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xl font-bold tracking-[0.3em] outline-none focus:border-lime-600"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  autoFocus
                  required
                />
              </label>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
              {successMessage && <p className="text-sm text-lime-700">{successMessage}</p>}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isResending}
                  className="font-semibold text-lime-700 hover:text-lime-800 disabled:opacity-50"
                >
                  {resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend Code"}
                </button>
              </div>

              <button
                className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800 disabled:opacity-60 transition"
                type="submit"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying…" : "Verify Code"}
              </button>

              <button
                type="button"
                className="mt-2 block w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700"
                onClick={() => {
                  setStep("email");
                  setFormError("");
                }}
              >
                Change Email Address
              </button>
            </form>
          </>
        )}

        {step === "newPassword" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900">Set New Password</h1>
            <p className="mt-2 text-slate-500">
              Choose a new password for your account.
            </p>
            <form className="mt-7 space-y-4" onSubmit={handleResetPassword}>
              <label className="block text-sm font-semibold text-slate-700">
                New Password
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 outline-none focus:border-lime-600"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Confirm Password
                <div className="relative mt-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 outline-none focus:border-lime-600"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {formError && <p className="text-sm text-red-600">{formError}</p>}
              {successMessage && <p className="text-sm text-lime-700">{successMessage}</p>}

              <button
                className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800 disabled:opacity-60 transition"
                type="submit"
                disabled={isResetting}
              >
                {isResetting ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}

     
      </section>
    </div>
  );
}

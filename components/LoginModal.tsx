"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  LoaderCircle,
  Lock,
  LogInIcon,
  Mail,
  RefreshCcw,
  X,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import {
  useLazyGetMeQuery,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../redux/services/authApi";
import { emailLoginSchema } from "@/schemas/authSchema";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { useMergeCartMutation } from "../redux/services/cartApi";
import { getGuestCart, clearGuestCart } from "../lib/guestCart";
import GoogleSignInButton from "./GoogleSignInButton";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

type Step = "email" | "verifyOtp";

const RESEND_COOLDOWN_SECONDS = 30;

export default function LoginModal({
  open,
  onClose,
  onOpenRegister,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [login, { isLoading }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [mergeCart] = useMergeCartMutation();
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();

  const syncGuestCart = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;
    try {
      const mergeRes = await mergeCart({
        items: guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap();
      clearGuestCart();
      const report = mergeRes?.data?.mergeReport;
      if (report?.adjustedItems?.length) {
        toast("Some cart items were adjusted to available stock.");
      }
      if (report?.outOfStockItems?.length || report?.skippedInactiveItems?.length) {
        toast("Unavailable items were removed from your cart.");
      }
    } catch {
      // keep guest cart if merge fails
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = window.setInterval(() => {
      setResendTimer((sec) => Math.max(0, sec - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const onSubmit = async (data: { email: string; password: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();

    try {
      setError("");
      const res = await login({
        email: cleanEmail,
        password: data.password,
      }).unwrap();

      // Access token is held in Redux memory (no localStorage)
      dispatch(setCredentials(res));

      try {
        const me = await getMe().unwrap();
        dispatch(setCredentials(me));
      } catch {}

      await syncGuestCart();

      reset();
      toast.success("Logged in successfully.");
      onClose();
    } catch (loginError: unknown) {
      const apiError = loginError as {
        data?: {
          message?: string;
          requiresVerification?: boolean;
          email?: string;
          errors?: Record<string, string>;
        };
      };

      const errorMsg =
        apiError.data?.message ||
        (apiError.data?.errors && Object.values(apiError.data.errors)[0]) ||
        "Unable to log in. Please check your credentials.";

      if (apiError.data?.requiresVerification) {
        setPendingEmail(apiError.data.email || cleanEmail);
        setOtpDigits(["", "", "", "", "", ""]);
        setStep("verifyOtp");
        setResendTimer(RESEND_COOLDOWN_SECONDS);
        toast(errorMsg);
      } else {
        toast.error(errorMsg);
        setError(errorMsg);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = value.slice(-1);
    setOtpDigits(nextDigits);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setError("");
      const res = await verifyOtp({
        email: pendingEmail,
        otp: fullOtp,
      }).unwrap();

      // Access token is held in Redux memory (no localStorage)
      dispatch(setCredentials(res));

      try {
        const me = await getMe().unwrap();
        dispatch(setCredentials(me));
      } catch {}

      await syncGuestCart();

      toast.success("Email verified and logged in successfully!");
      reset();
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError(
        apiError.data?.message || "Invalid or expired OTP. Please try again."
      );
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isSendingOtp) return;
    try {
      setError("");
      await sendOtp({ email: pendingEmail }).unwrap();
      setResendTimer(RESEND_COOLDOWN_SECONDS);
      toast.success("A fresh OTP has been sent to your email.");
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string } };
      setError(apiError.data?.message || "Failed to resend OTP.");
    }
  };

  useEffect(() => {
    if (!open) {
      setStep("email");
      setError("");
      setPendingEmail("");
      setOtpDigits(["", "", "", ""]);
    }
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/40
        p-3 sm:p-4
        backdrop-blur-[2px]
      "
      onMouseDown={handleOutsideClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-[var(--color-border)]
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.22)]
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            {step === "verifyOtp" && (
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  text-[var(--color-text-secondary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                {step === "email" && "Sign In"}
                {step === "verifyOtp" && "Verify Your Email"}
              </h2>

              <p className="text-xs text-[var(--color-text-muted)]">
                {step === "email" && "Welcome back! Enter your credentials to continue"}
                {step === "verifyOtp" && `Enter 6-digit code sent to ${pendingEmail}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-[var(--color-text-secondary)]
              transition
              hover:bg-gray-100
            "
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6">
          {/* EMAIL LOGIN FORM */}
          {step === "email" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-[var(--color-text-muted)]
                    "
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="
                      h-12 w-full
                      rounded-xl
                      border border-[var(--color-border)]
                      py-3 pl-11 pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-[var(--color-primary)]
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                    {...register("email")}
                  />
                </div>
                {errors.email?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    onClick={onClose}
                    className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="
                      absolute left-4 top-1/2
                      -translate-y-1/2
                      text-[var(--color-text-muted)]
                    "
                  />

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="
                      h-12 w-full
                      rounded-xl
                      border border-[var(--color-border)]
                      py-3 pl-11 pr-4
                      text-sm
                      outline-none
                      transition
                      focus:border-[var(--color-primary)]
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                    {...register("password")}
                  />
                </div>
                {errors.password?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* REMEMBER ME */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-primary)]"
                />

                <span className="text-sm text-[var(--color-text-secondary)]">
                  Remember me 
                </span>
              </label>

             <button
                type="submit"
                disabled={isLoading}
                className="
                  flex h-12 w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-sm font-semibold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[var(--color-primary-dark)]
                  active:scale-[0.99]
                  disabled:opacity-60
                "
              >
                {isLoading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <>
                    <LogInIcon size={18} />
                    <span>Login</span>
                  </>
                )}
              </button>

              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-[var(--color-border)]" />
                <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  or
                </span>
              </div>

              <GoogleSignInButton
                mode="signin"
                onSuccess={() => {
                  onClose();
                }}
              />

              <div className="pt-2 text-center text-xs text-[var(--color-text-muted)]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION STEP (FOR UNVERIFIED ACCOUNTS) */}
          {step === "verifyOtp" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 leading-relaxed">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <KeyRound size={15} className="text-amber-700" />
                  <span>Email Verification Pending</span>
                </div>
                Your account was registered but not verified yet. We just sent a
                6-digit code to <b>{pendingEmail}</b>. Please enter it below to complete verification and log in.
              </div>

              <div>
                <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="
                        h-12 w-10 sm:h-14 sm:w-12
                        rounded-xl
                        border-2 border-[var(--color-border)]
                        text-center text-lg sm:text-xl font-bold
                        outline-none
                        transition
                        focus:border-[var(--color-primary)]
                        focus:ring-2 focus:ring-[var(--color-primary)]/15
                      "
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpDigits.join("").length < 4}
                className="
                  flex h-12 w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-sm font-semibold
                  text-white
                  shadow-md
                  transition
                  hover:bg-[var(--color-primary-dark)]
                  active:scale-[0.99]
                  disabled:opacity-50
                "
              >
                {isVerifying ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <span>Verify Email & Log In</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                >
                  ← Back to Login
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isSendingOtp}
                  className="font-semibold text-[var(--color-primary)] hover:underline disabled:opacity-50"
                >
                  {isSendingOtp
                    ? "Sending..."
                    : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend Code"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

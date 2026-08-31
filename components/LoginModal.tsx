"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  Info,
  KeyRound,
  LoaderCircle,
  Lock,
  LogInIcon,
  Mail,
  Phone,
  RefreshCcw,
  ShieldCheck,
  X,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
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

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

type LoginMethod = "phone" | "email";
type Step = "welcome" | "phone" | "email" | "verifyOtp";

const RESEND_COOLDOWN_SECONDS = 30;

export default function LoginModal({
  open,
  onClose,
  onOpenRegister,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [login, { isLoading }] = useLoginMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [getMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();

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
    if (!acceptedTerms) {
      setError("Please accept the Terms & Conditions to continue.");
      return;
    }

    const cleanEmail = data.email.trim().toLowerCase();

    try {
      setError("");
      const res = await login({
        email: cleanEmail,
        password: data.password,
      }).unwrap();

      dispatch(setCredentials(await getMe().unwrap()));
      reset();
      toast.success("Logged in successfully.");
      onClose();
    } catch (loginError: unknown) {
      const apiError = loginError as {
        data?: {
          message?: string;
          requiresVerification?: boolean;
          email?: string;
        };
      };

      if (apiError.data?.requiresVerification) {
        setPendingEmail(apiError.data.email || cleanEmail);
        setOtpDigits(["", "", "", ""]);
        setStep("verifyOtp");
        setResendTimer(RESEND_COOLDOWN_SECONDS);
        toast("Please verify your email with the 4-digit code.", {
          icon: "📩",
        });
      } else {
        setError(
          apiError.data?.message || "Unable to log in. Please try again."
        );
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = value.slice(-1);
    setOtpDigits(nextDigits);

    if (value && index < 3) {
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
    if (fullOtp.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    try {
      setError("");
      await verifyOtp({
        email: pendingEmail,
        otp: fullOtp,
      }).unwrap();

      dispatch(setCredentials(await getMe().unwrap()));
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
      setStep("welcome");
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

  const handleSelectMethod = (selected: LoginMethod) => {
    setStep(selected);
    setError("");
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
            {step !== "welcome" && (
              <button
                type="button"
                onClick={() => {
                  setStep("welcome");
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
                {step === "welcome" && "Welcome to SFC Cafe"}
                {step === "phone" && "Continue with Phone"}
                {step === "email" && "Sign In with Email"}
                {step === "verifyOtp" && "Verify Your Email"}
              </h2>

              <p className="text-xs text-[var(--color-text-muted)]">
                {step === "welcome" && "Sign in to continue ordering"}
                {step === "phone" && "We'll send a verification code"}
                {step === "email" && "Enter your credentials to continue"}
                {step === "verifyOtp" && `Enter 4-digit code sent to ${pendingEmail}`}
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
          {/* STEP 1: WELCOME */}
          {step === "welcome" && (
            <div className="space-y-4">
              <div className="mb-6 text-center">
                <div
                  className="
                    mx-auto mb-4
                    flex h-14 w-14
                    items-center justify-center
                    rounded-2xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <ShieldCheck size={28} />
                </div>

                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                  Sign in to your account
                </h3>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Save favorites, track orders and checkout faster.
                </p>
              </div>

              {/* PHONE */}
              <button
                type="button"
                onClick={() =>
                  toast("Phone login coming soon. Please use Email login.", {
                    icon: <Info />,
                    duration: 2000,
                  })
                }
                className="
                  group flex w-full
                  items-center gap-4
                  rounded-2xl
                  border border-[var(--color-border)]
                  bg-white
                  p-4
                  text-left
                  transition
                  hover:border-[var(--color-primary)]
                  hover:bg-[var(--color-primary-50)]
                "
              >
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Phone size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Continue with Phone
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    Get a quick OTP on your mobile
                  </p>
                </div>

                <ChevronLeft
                  size={18}
                  className="
                    rotate-180
                    text-[var(--color-text-muted)]
                    transition
                    group-hover:text-[var(--color-primary)]
                  "
                />
              </button>

              {/* EMAIL */}
              <button
                type="button"
                onClick={() => handleSelectMethod("email")}
                className="
                  group flex w-full
                  items-center gap-4
                  rounded-2xl
                  border border-[var(--color-border)]
                  bg-white
                  p-4
                  text-left
                  transition
                  hover:border-[var(--color-primary)]
                  hover:bg-[var(--color-primary-50)]
                "
              >
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Mail size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    Continue with Email
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    Use your registered email & password
                  </p>
                </div>

                <ChevronLeft
                  size={18}
                  className="
                    rotate-180
                    text-[var(--color-text-muted)]
                    transition
                    group-hover:text-[var(--color-primary)]
                  "
                />
              </button>

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

              <div className="pt-3 border-t border-[var(--color-border)] text-center text-[11px] text-[var(--color-text-muted)]">
                By continuing, you agree to our{" "}
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="underline hover:text-[var(--color-primary)]"
                >
                  Terms
                </Link>
                ,{" "}
                <Link
                  href="/privacy-policy"
                  onClick={onClose}
                  className="underline hover:text-[var(--color-primary)]"
                >
                  Privacy Policy
                </Link>{" "}
                &{" "}
                <Link
                  href="/refund-policy"
                  onClick={onClose}
                  className="underline hover:text-[var(--color-primary)]"
                >
                  Refund Policy
                </Link>
                .
              </div>
            </div>
          )}

          {/* STEP 2: EMAIL LOGIN FORM */}
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
                  Remember me on this device
                </span>
              </label>

              {/* TERMS */}
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                />

                <span className="text-xs leading-5 text-[var(--color-text-secondary)]">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    onClick={onClose}
                    className="font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
                  >
                    Terms & Conditions
                  </Link>
                  ,{" "}
                  <Link
                    href="/privacy-policy"
                    onClick={onClose}
                    className="font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/refund-policy"
                    onClick={onClose}
                    className="font-semibold text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
                  >
                    Refund Policy
                  </Link>
                  .
                </span>
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

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
                    <span>Sign In</span>
                  </>
                )}
              </button>

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
                4-digit code to <b>{pendingEmail}</b>. Please enter it below to complete verification and log in.
              </div>

              <div>
                <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Enter 4-Digit Code
                </label>
                <div className="flex justify-center gap-3">
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
                        h-14 w-12
                        rounded-xl
                        border-2 border-[var(--color-border)]
                        text-center text-xl font-bold
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

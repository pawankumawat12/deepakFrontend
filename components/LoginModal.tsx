"use client";

import {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronLeft,
  Info,
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
import { useLoginMutation } from '../redux/services/authApi'
import { emailLoginSchema } from '../schemas/authSchema';
interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type LoginMethod = "phone" | "email";
type Step = "welcome" | "phone" | "email";

export default function LoginModal({
  open,
  onClose,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("welcome");

  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);



  const [login, { isLoading }] = useLoginMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })



  useEffect(() => {
    if (!open) {
      setStep("welcome");
      setError("");

    }
  }, [open]);


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent | any) => {
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


  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
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

                {step === "email" && "Continue with Email"}

              </h2>

              <p className="text-xs text-[var(--color-text-muted)]">
                {step === "welcome" &&
                  "Sign in to continue ordering"}

                {step === "phone" &&
                  "We'll send a verification code"}

                {step === "email" &&
                  ""}


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


        <div className="p-5 sm:p-6">

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
                // onClick={() => handleSelectMethod("phone")}
                onClick={() => toast("Comming soon", {
                  icon: <Info />,
                  duration: 1000,
                })}
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
                    Receive OTP securely in your inbox
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

              <p className="pt-2 text-center text-xs text-[var(--color-text-muted)]">
                By continuing, you agree to our Terms & Privacy Policy.
              </p>
            </div>
          )}

          {(step === "phone" || step === "email") && (
            <form
              className="space-y-5"
            >
              {/* {step === "phone" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                    Phone number
                  </label>

                  <div className="flex gap-2">
                    <div
                      className="
                        flex h-12 items-center
                        rounded-xl
                        border border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        px-3
                        text-sm font-medium
                      "
                    >
                      +91
                    </div>

                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="
                        h-12 flex-1
                        rounded-xl
                        border border-[var(--color-border)]
                        px-4
                        text-sm
                        outline-none
                        transition
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />
                  </div>

                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    We'll send a 6-digit OTP to this number.
                  </p>
                </div>
              )} */}

              {/* EMAIL */}

              {step === "email" && (
                <>
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
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                      Password
                    </label>

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
                        placeholder="System@123"
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
                      />
                    </div>


                  </div>
                </>


              )}

              {/* REMEMBER ME */}

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="
                    h-4 w-4
                    accent-[var(--color-primary)]
                  "
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
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  className="
                    mt-1 h-4 w-4 shrink-0
                    accent-[var(--color-primary)]
                  "
                />

                <span className="text-xs leading-5 text-[var(--color-text-secondary)]">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="
                      font-semibold
                      text-[var(--color-primary)]
                      hover:underline
                    "
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="
                      font-semibold
                      text-[var(--color-primary)]
                      hover:underline
                    "
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* ERROR */}

              {error && (
                <div
                  className="
                    rounded-xl
                    bg-red-50
                    px-4 py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="
                  flex h-12 w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-[var(--color-primary-dark)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Login
                <LogInIcon size={17} />
              </button>
            </form>
          )}


          {/* {step === "otp" && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto mb-4
                    flex h-12 w-12
                    items-center justify-center
                    rounded-2xl
                    bg-[var(--color-primary-50)]
                    text-[var(--color-primary)]
                  "
                >
                  <Check size={24} />
                </div>

                <p className="text-sm text-[var(--color-text-secondary)]">
                  Enter the 6-digit code sent to
                </p>

                <p className="mt-1 break-all font-semibold text-[var(--color-text-primary)]">
                  {contact}
                </p>

                <button
                  type="button"
                  onClick={() => setStep(method)}
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    text-[var(--color-primary)]
                    hover:underline
                  "
                >
                  Change {method === "phone" ? "number" : "email"}
                </button>
              </div>


              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {otpValue.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(index, e)
                    }
                    onPaste={handleOtpPaste}
                    className="
                      aspect-square
                      w-full
                      rounded-xl
                      border border-[var(--color-border)]
                      bg-[var(--bg-body)]
                      text-center
                      text-lg
                      font-bold
                      outline-none
                      transition
                      focus:border-[var(--color-primary)]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[var(--color-primary)]/10
                    "
                  />
                ))}
              </div>

              {error && (
                <div
                  className="
                    rounded-xl
                    bg-red-50
                    px-4 py-3
                    text-center
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}


              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  otpValue.some((digit) => !digit)
                }
                className="
                  flex h-12 w-full
                  items-center justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary)]
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-[var(--color-primary-dark)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSubmitting
                  ? "Verifying..."
                  : "Verify & Continue"}

                <ShieldCheck size={17} />
              </button>


              <div className="text-center">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  disabled={
                    resendTimer > 0 || isSubmitting
                  }
                  onClick={handleResend}
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[var(--color-primary)]
                    disabled:text-[var(--color-text-muted)]
                  "
                >
                  <RefreshCcw size={15} />

                  {resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              </div>


              <div
                className="
                  flex items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  px-4 py-3
                  text-xs
                  text-[var(--color-text-secondary)]
                "
              >
                <ShieldCheck
                  size={16}
                  className="text-[var(--color-primary)]"
                />

                {rememberMe
                  ? "You will stay signed in on this device."
                  : "You will be signed out when your session ends."}
              </div>
            </form>
          )} */}
        </div>


        <div
          className="
            border-t
            border-[var(--color-border)]
            bg-[var(--bg-body)]
            px-5 py-3
            text-center
          "
        >
          <p className="text-[11px] text-[var(--color-text-muted)]">
            🔒 Your information is securely protected by SFC Cafe.
          </p>
        </div>
      </div>
    </div>
  );
}
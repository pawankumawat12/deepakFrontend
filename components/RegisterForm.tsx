"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Mail,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../redux/services/authApi";
import { setCredentials } from "../redux/features/authSlice";
import {
  registerSchema,
  verifyOtpSchema,
} from "../schemas/authSchema";

type ApiError = {
  data?: { message?: string; errors?: Record<string, string> };
};
type RegistrationValues = z.infer<typeof registerSchema>;
type VerificationValues = z.infer<typeof verifyOtpSchema>;
const messageFor = (error: unknown) => {
  const apiError = error as ApiError;
  return (
    apiError.data?.message ||
    Object.values(apiError.data?.errors || {})[0] ||
    "Something went wrong. Please try again."
  );
};

export default function RegisterForm({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [registerAccount, { isLoading: isRegistering }] = useRegisterMutation();
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const registration = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const verification = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const startVerification = async (values: RegistrationValues) => {
    const account = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone || undefined,
      password: values.password,
    };
    try {
      await registerAccount(account).unwrap();
      setEmail(account.email);
      setOtpDigits(["", "", "", ""]);
      verification.reset({ otp: "" });
      setStep("verify");
      toast.success("A verification code has been sent to your email.");
    } catch (error) {
      toast.error(messageFor(error));
    }
  };

  const completeRegistration = async ({ otp }: VerificationValues) => {
    try {
      const response = await verifyOtp({ email, otp }).unwrap();
      dispatch(setCredentials(response));
      toast.success("Your account is verified. Welcome!");
      if (onComplete) {
        onComplete();
      } else {
        router.replace("/");
      }
    } catch (error) {
      toast.error(messageFor(error));
    }
  };

  const resend = async () => {
    try {
      await sendOtp({ email }).unwrap();
      setOtpDigits(["", "", "", ""]);
      verification.reset({ otp: "" });
      otpRefs.current[0]?.focus();
      toast.success("A new verification code has been sent.");
    } catch (error) {
      toast.error(messageFor(error));
    }
  };

  const setOtp = (digits: string[]) => {
    setOtpDigits(digits);
    verification.setValue("otp", digits.join(""), { shouldValidate: true });
  };

  const changeOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtp(next);
    if (digit && index < next.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const pasteOtp = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!digits) return;

    const next = Array.from({ length: 4 }, (_, index) => digits[index] || "");
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 4) - 1]?.focus();
  };

  const input =
    "mt-1 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";
  return (
    <div className="w-full max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-xl sm:p-8">
      <header className="mb-7 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
          {step === "register" ? <UserPlus /> : <KeyRound />}
        </div>
        <h1 className="text-2xl font-bold">
          {step === "register" ? "Create your account" : "Verify your email"}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {step === "register" ? (
            "Register to save favourites and order faster."
          ) : (
            <>
              Enter the code sent to <strong>{email}</strong>.
            </>
          )}
        </p>
      </header>
      {step === "register" ? (
        <form
          className="space-y-4"
          onSubmit={registration.handleSubmit(startVerification)}
          noValidate
        >
          <Input
            label="Full name"
            error={registration.formState.errors.name?.message}
          >
            <input
              className={input}
              autoComplete="name"
              {...registration.register("name")}
            />
          </Input>
          <Input
            label="Email address"
            error={registration.formState.errors.email?.message}
          >
            <input
              className={input}
              type="email"
              autoComplete="email"
              {...registration.register("email")}
            />
          </Input>
          <Input
            label="Phone number (optional)"
            error={registration.formState.errors.phone?.message}
          >
            <input
              className={input}
              inputMode="numeric"
              autoComplete="tel"
              {...registration.register("phone")}
            />
          </Input>
          <Input
            label="Password"
            error={registration.formState.errors.password?.message}
          >
            <input
              className={input}
              type="password"
              autoComplete="new-password"
              {...registration.register("password")}
            />
          </Input>
          <Input
            label="Confirm password"
            error={registration.formState.errors.confirmPassword?.message}
          >
            <input
              className={input}
              type="password"
              autoComplete="new-password"
              {...registration.register("confirmPassword")}
            />
          </Input>
          <Submit busy={isRegistering || isSending} text="Create account" />
        </form>
      ) : (
        <form
          className="space-y-5"
          onSubmit={verification.handleSubmit(completeRegistration)}
          noValidate
        >
          <div>
            <p className="text-sm font-medium">4-digit verification code</p>
            <div className="mt-2 flex justify-center gap-3">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  aria-label={`Verification code digit ${index + 1}`}
                  className="h-12 w-12 rounded-xl border border-[var(--color-border)] bg-white text-center text-xl font-semibold outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => changeOtpDigit(index, event.target.value)}
                  onPaste={pasteOtp}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>
            {verification.formState.errors.otp?.message && (
              <span className="mt-1 block text-xs font-normal text-red-600">
                {verification.formState.errors.otp.message}
              </span>
            )}
          </div>
          <Submit busy={isVerifying} text="Verify and continue" verified />
          <button
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary)] disabled:opacity-50"
            type="button"
            disabled={isSending}
            onClick={resend}
          >
            <Mail size={16} /> Resend code
          </button>
          <button
            className="w-full text-sm text-[var(--color-text-secondary)]"
            type="button"
            onClick={() => {
              verification.reset({ otp: "" });
              setOtpDigits(["", "", "", ""]);
              setStep("register");
            }}
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs font-normal text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
function Submit({
  busy,
  text,
  verified,
}: {
  busy: boolean;
  text: string;
  verified?: boolean;
}) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={busy}
    >
      {busy ? (
        <LoaderCircle className="animate-spin" size={18} />
      ) : verified ? (
        <CheckCircle2 size={18} />
      ) : null}
      {text}
    </button>
  );
}

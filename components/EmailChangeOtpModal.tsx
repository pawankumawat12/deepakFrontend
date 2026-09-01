"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mail,
  ShieldCheck,
  RotateCw,
  Check,
  LoaderCircle,
  Pencil,
  AlertTriangle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/features/authSlice";
import {
  AuthUser,
  useResendEmailChangeOtpMutation,
  useVerifyEmailChangeMutation,
  useCancelEmailChangeMutation,
} from "@/redux/services/authApi";

interface EmailChangeOtpModalProps {
  open: boolean;
  onClose: () => void;
  pendingEmail: string;
  onSuccess?: (user: AuthUser) => void;
  onEditEmail?: () => void;
}

export default function EmailChangeOtpModal({
  open,
  onClose,
  pendingEmail,
  onSuccess,
  onEditEmail,
}: EmailChangeOtpModalProps) {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(30);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmailChange, { isLoading: isVerifying }] = useVerifyEmailChangeMutation();
  const [resendEmailChangeOtp, { isLoading: isResending }] = useResendEmailChangeOtpMutation();
  const [cancelEmailChange] = useCancelEmailChangeMutation();

  // Reset state on open
  useEffect(() => {
    if (open) {
      setOtp(["", "", "", ""]);
      setTimer(30);
      setErrorMessage("");
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [open, pendingEmail]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, timer]);

  if (!open) return null;

  const handleOtpChange = (index: number, value: string) => {
    setErrorMessage("");
    // Allow only single digits
    const cleanValue = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 4 digits are filled
    const fullCode = newOtp.join("");
    if (fullCode.length === 4 && !newOtp.includes("")) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pastedData) return;

    const newOtp = ["", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();

    if (pastedData.length === 4) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullOtp = codeToVerify || otp.join("");
    if (fullOtp.length !== 4) {
      setErrorMessage("Please enter the complete 4-digit verification code");
      return;
    }

    try {
      setErrorMessage("");
      const response = await verifyEmailChange({
        otp: fullOtp,
        newEmail: pendingEmail,
      }).unwrap();

      if (response?.user) {
        dispatch(setCredentials(response));
        if (response.token || response.accessToken) {
          localStorage.setItem("accessToken", response.token || response.accessToken || "");
        }
      }

      toast.success(response?.message || "Email verified and updated successfully! 🎉");
      if (response?.user && onSuccess) {
        onSuccess(response.user);
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        "Invalid or expired verification code. Please check and try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    try {
      setErrorMessage("");
      const res = await resendEmailChangeOtp({ newEmail: pendingEmail }).unwrap();
      toast.success(res?.message || `New code sent to ${pendingEmail}`);
      setTimer(30);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to resend verification code";
      toast.error(msg);
      if (err?.data?.retryAfter) {
        setTimer(err.data.retryAfter);
      }
    }
  };

  const handleCancelModal = async () => {
    try {
      await cancelEmailChange().unwrap();
    } catch {
      // Ignore cancellation errors
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={handleCancelModal}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-2xl transition-all duration-200 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER ICON & CLOSE */}
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)] shadow-sm">
            <ShieldCheck size={26} />
          </div>

          <button
            type="button"
            onClick={handleCancelModal}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="mt-4">
          <h3 className="text-xl font-black text-[var(--color-text-primary)]">
            Verify Your New Email
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            We’ve sent a 4-digit verification code to:
          </p>

          <div className="mt-2.5 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-stone-50 px-3.5 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Mail size={15} className="text-[var(--color-primary)] shrink-0" />
              <span className="truncate text-xs font-black text-[var(--color-text-primary)]">
                {pendingEmail}
              </span>
            </div>

            {onEditEmail && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditEmail();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)] hover:underline shrink-0"
              >
                <Pencil size={11} />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* OTP INPUTS */}
        <div className="mt-6">
          <label className="mb-2 block text-center text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
            Enter 4-Digit Code
          </label>

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying}
                className={`
                  h-14
                  w-14
                  rounded-2xl
                  border-2
                  bg-stone-50/70
                  text-center
                  text-xl
                  font-black
                  text-[var(--color-text-primary)]
                  outline-none
                  transition-all
                  duration-150
                  focus:border-[var(--color-primary)]
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[var(--color-primary)]/10
                  ${
                    errorMessage
                      ? "border-red-400 bg-red-50/40 text-red-700"
                      : digit
                      ? "border-[var(--color-primary)] bg-white text-[var(--color-primary)]"
                      : "border-[var(--color-border)]"
                  }
                `}
              />
            ))}
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-red-500">
              <AlertTriangle size={13} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* TIMER & RESEND */}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
            <Clock size={13} />
            <span>Valid for 10 mins</span>
          </div>

          <div>
            {timer > 0 ? (
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Resend code in <strong className="font-mono text-[var(--color-primary)]">{timer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] hover:underline active:scale-95 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <LoaderCircle size={13} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RotateCw size={12} />
                    <span>Resend OTP</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelModal}
            disabled={isVerifying}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-white py-3 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-stone-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleVerify()}
            disabled={isVerifying || otp.join("").length !== 4}
            className="
              flex
              flex-[2]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[var(--color-primary)]
              py-3
              text-xs
              font-black
              text-white
              shadow-lg
              shadow-[var(--color-primary)]/25
              transition-all
              hover:bg-[var(--color-primary-dark)]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isVerifying ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Verify & Update Email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

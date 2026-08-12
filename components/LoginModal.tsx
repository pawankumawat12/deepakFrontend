// "use client";

// import { FormEvent, useEffect, useState } from "react";
// import {
//   ArrowLeft,
//   CheckCircle2,
//   Mail,
//   Phone,
//   RefreshCcw,
//   ShieldCheck,
//   X,
// } from "lucide-react";

// interface LoginModalProps {
//   open: boolean;
//   onClose: () => void;
// }

// type Step = "method" | "phone" | "email" | "otp";
// type Method = "phone" | "email";

// const emptyOtp = ["", "", "", "", "", ""];

// export default function LoginModal({
//   open,
//   onClose,
// }: LoginModalProps) {
//   const [step, setStep] = useState<Step>("method");
//   const [method, setMethod] = useState<Method>("phone");

//   const [phoneValue, setPhoneValue] = useState("");
//   const [emailValue, setEmailValue] = useState("");

//   const [otpValue, setOtpValue] = useState<string[]>(emptyOtp);
//   const [resendTimer, setResendTimer] = useState(30);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /* ---------------- RESET MODAL ---------------- */

//   useEffect(() => {
//     if (!open) {
//       setStep("method");
//       setMethod("phone");
//       setOtpValue(emptyOtp);
//       setResendTimer(30);
//       setIsSubmitting(false);
//     }
//   }, [open]);

//   /* ---------------- OTP TIMER ---------------- */

//   useEffect(() => {
//     if (!open || step !== "otp" || resendTimer <= 0) {
//       return;
//     }

//     const timer = window.setTimeout(() => {
//       setResendTimer((value) => Math.max(value - 1, 0));
//     }, 1000);

//     return () => window.clearTimeout(timer);
//   }, [open, step, resendTimer]);

//   /* ---------------- ESCAPE ---------------- */

//   useEffect(() => {
//     if (!open) return;

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [open, onClose]);

//   /* ---------------- SEND OTP ---------------- */

//   const handleSendOtp = (
//     event: FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setIsSubmitting(true);

//     window.setTimeout(() => {
//       setIsSubmitting(false);
//       setOtpValue(emptyOtp);
//       setResendTimer(30);
//       setStep("otp");
//     }, 500);
//   };

//   /* ---------------- VERIFY OTP ---------------- */

//   const handleVerifyOtp = (
//     event: FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setIsSubmitting(true);

//     window.setTimeout(() => {
//       setIsSubmitting(false);

//       alert("OTP verified! (UI-only demo)");

//       onClose();
//     }, 600);
//   };

//   /* ---------------- RESEND OTP ---------------- */

//   const handleResend = () => {
//     if (resendTimer > 0 || isSubmitting) return;

//     setIsSubmitting(true);

//     window.setTimeout(() => {
//       setIsSubmitting(false);
//       setResendTimer(30);

//       alert("OTP resent! (UI-only demo)");
//     }, 500);
//   };

//   /* ---------------- OTP INPUT ---------------- */

//   const handleOtpChange = (
//     index: number,
//     value: string
//   ) => {
//     if (!/^\d*$/.test(value)) return;

//     const next = [...otpValue];

//     next[index] = value.slice(-1);

//     setOtpValue(next);

//     if (value && index < 5) {
//       const nextInput =
//         document.getElementById(
//           `otp-${index + 2}`
//         ) as HTMLInputElement | null;

//       nextInput?.focus();
//     }
//   };

//   /* ---------------- OTP BACKSPACE ---------------- */

//   const handleOtpKeyDown = (
//     index: number,
//     event: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (
//       event.key === "Backspace" &&
//       !otpValue[index] &&
//       index > 0
//     ) {
//       const previousInput =
//         document.getElementById(
//           `otp-${index}`
//         ) as HTMLInputElement | null;

//       previousInput?.focus();
//     }
//   };

//   if (!open) return null;

//   const destination =
//     method === "phone"
//       ? phoneValue
//       : emailValue;

//   return (
//     <div
//       className="
//         fixed inset-0 z-[100]
//         flex items-end justify-center
//         bg-black/45
//         p-0
//         backdrop-blur-[3px]
//         sm:items-center
//         sm:p-4
//       "
//       role="dialog"
//       aria-modal="true"
//       aria-label="SFC Cafe Login"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) {
//           onClose();
//         }
//       }}
//     >
//       {/* =====================================================
//           MODAL
//       ===================================================== */}

//       <div
//         className="
//           relative
//           w-full
//           max-w-[430px]
//           overflow-hidden
//           rounded-t-[28px]
//           bg-[var(--bg-surface)]
//           shadow-[0_-10px_50px_rgba(0,0,0,0.18)]
//           animate-fade-up

//           sm:rounded-[24px]
//           sm:shadow-[0_25px_80px_rgba(0,0,0,0.22)]
//         "
//         onMouseDown={(event) => event.stopPropagation()}
//       >
//         {/* Mobile drag indicator */}

//         <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[var(--color-border)] sm:hidden" />

//         {/* Close */}

//         <button
//           type="button"
//           onClick={onClose}
//           aria-label="Close login"
//           className="
//             absolute
//             right-4
//             top-4
//             z-10
//             flex
//             h-9
//             w-9
//             items-center
//             justify-center
//             rounded-full
//             text-[var(--color-text-muted)]
//             transition
//             hover:bg-[var(--color-primary-50)]
//             hover:text-[var(--color-primary)]
//           "
//         >
//           <X size={19} />
//         </button>

//         {/* =====================================================
//             CONTENT
//         ===================================================== */}

//         <div className="px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">

//           {/* HEADER */}

//           <div className="mb-7 pr-8">
//             <div className="mb-4 flex items-center gap-3">

//               {step !== "method" && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep(
//                       step === "otp"
//                         ? method
//                         : "method"
//                     );
//                   }}
//                   className="
//                     flex
//                     h-8
//                     w-8
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-[var(--color-primary-50)]
//                     text-[var(--color-primary)]
//                     transition
//                     hover:bg-[var(--color-primary)]
//                     hover:text-white
//                   "
//                 >
//                   <ArrowLeft size={16} />
//                 </button>
//               )}

//               <div
//                 className="
//                   flex
//                   h-10
//                   w-10
//                   items-center
//                   justify-center
//                   rounded-xl
//                   bg-[var(--color-primary)]
//                   text-white
//                   shadow-sm
//                 "
//               >
//                 {step === "email" ||
//                 (step === "otp" &&
//                   method === "email") ? (
//                   <Mail size={19} />
//                 ) : (
//                   <Phone size={19} />
//                 )}
//               </div>

//               <div>
//                 <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
//                   SFC Cafe
//                 </p>

//                 <p className="text-xs text-[var(--color-text-muted)]">
//                   Quick & easy login
//                 </p>
//               </div>
//             </div>

//             <h2 className="text-[25px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
//               {step === "method" && "Welcome back!"}
//               {step === "phone" && "Enter your phone"}
//               {step === "email" && "Enter your email"}
//               {step === "otp" && "Verify your OTP"}
//             </h2>

//             <p className="mt-1.5 text-sm leading-5 text-[var(--color-text-secondary)]">
//               {step === "method" &&
//                 "Login to order faster and keep track of your favorites."}

//               {step === "phone" &&
//                 "We'll send a one-time code to your phone."}

//               {step === "email" &&
//                 "We'll send a one-time code to your email."}

//               {step === "otp" &&
//                 `Enter the 6-digit code sent to ${destination}.`}
//             </p>
//           </div>

//           {/* =====================================================
//               METHOD SELECTOR
//           ===================================================== */}

//           {step === "method" && (
//             <LoginMethodSelector
//               onSelect={(selected) => {
//                 setMethod(selected);
//                 setStep(selected);
//               }}
//             />
//           )}

//           {/* =====================================================
//               PHONE
//           ===================================================== */}

//           {step === "phone" && (
//             <PhoneLogin
//               value={phoneValue}
//               onChange={setPhoneValue}
//               onSubmit={handleSendOtp}
//               disabled={isSubmitting}
//             />
//           )}

//           {/* =====================================================
//               EMAIL
//           ===================================================== */}

//           {step === "email" && (
//             <EmailLogin
//               value={emailValue}
//               onChange={setEmailValue}
//               onSubmit={handleSendOtp}
//               disabled={isSubmitting}
//             />
//           )}

//           {/* =====================================================
//               OTP
//           ===================================================== */}

//           {step === "otp" && (
//             <OtpVerification
//               method={method}
//               contact={destination}
//               otpValue={otpValue}
//               onChangeOtp={handleOtpChange}
//               onKeyDown={handleOtpKeyDown}
//               onSubmit={handleVerifyOtp}
//               onResend={handleResend}
//               resendTimer={resendTimer}
//               disabled={isSubmitting}
//             />
//           )}

//           {/* FOOTER */}

//           {step !== "otp" && (
//             <p className="mt-6 text-center text-[11px] leading-5 text-[var(--color-text-muted)]">
//               By continuing, you agree to our{" "}
//               <span className="font-medium text-[var(--color-text-secondary)]">
//                 Terms
//               </span>{" "}
//               and{" "}
//               <span className="font-medium text-[var(--color-text-secondary)]">
//                 Privacy Policy
//               </span>
//               .
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    METHOD SELECTOR
// ============================================================ */

// function LoginMethodSelector({
//   onSelect,
// }: {
//   onSelect: (method: Method) => void;
// }) {
//   return (
//     <div className="space-y-3">

//       {/* Phone */}

//       <button
//         type="button"
//         onClick={() => onSelect("phone")}
//         className="
//           group
//           flex
//           w-full
//           items-center
//           gap-4
//           rounded-2xl
//           border
//           border-[var(--color-border)]
//           bg-white
//           p-4
//           text-left
//           transition-all
//           duration-200
//           hover:-translate-y-0.5
//           hover:border-[var(--color-primary)]
//           hover:shadow-[0_8px_25px_rgba(79,125,22,0.10)]
//           active:scale-[0.99]
//         "
//       >
//         <div
//           className="
//             flex
//             h-11
//             w-11
//             shrink-0
//             items-center
//             justify-center
//             rounded-xl
//             bg-[var(--color-primary-50)]
//             text-[var(--color-primary)]
//             transition
//             group-hover:bg-[var(--color-primary)]
//             group-hover:text-white
//           "
//         >
//           <Phone size={20} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="font-semibold text-[var(--color-text-primary)]">
//             Continue with Phone
//           </p>

//           <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
//             Get an OTP on your mobile
//           </p>
//         </div>

//         <ArrowLeft
//           size={17}
//           className="
//             rotate-180
//             text-[var(--color-text-muted)]
//             transition
//             group-hover:translate-x-1
//             group-hover:text-[var(--color-primary)]
//           "
//         />
//       </button>

//       {/* OR */}

//       <div className="flex items-center gap-3 py-1">
//         <div className="h-px flex-1 bg-[var(--color-border)]" />

//         <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
//           or
//         </span>

//         <div className="h-px flex-1 bg-[var(--color-border)]" />
//       </div>

//       {/* Email */}

//       <button
//         type="button"
//         onClick={() => onSelect("email")}
//         className="
//           group
//           flex
//           w-full
//           items-center
//           gap-4
//           rounded-2xl
//           border
//           border-[var(--color-border)]
//           bg-white
//           p-4
//           text-left
//           transition-all
//           duration-200
//           hover:-translate-y-0.5
//           hover:border-[var(--color-secondary)]
//           hover:shadow-[0_8px_25px_rgba(245,166,35,0.12)]
//           active:scale-[0.99]
//         "
//       >
//         <div
//           className="
//             flex
//             h-11
//             w-11
//             shrink-0
//             items-center
//             justify-center
//             rounded-xl
//             bg-orange-50
//             text-[var(--color-secondary)]
//             transition
//             group-hover:bg-[var(--color-secondary)]
//             group-hover:text-white
//           "
//         >
//           <Mail size={20} />
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="font-semibold text-[var(--color-text-primary)]">
//             Continue with Email
//           </p>

//           <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
//             Get an OTP in your inbox
//           </p>
//         </div>

//         <ArrowLeft
//           size={17}
//           className="
//             rotate-180
//             text-[var(--color-text-muted)]
//             transition
//             group-hover:translate-x-1
//             group-hover:text-[var(--color-secondary)]
//           "
//         />
//       </button>
//     </div>
//   );
// }

// /* ============================================================
//    PHONE LOGIN
// ============================================================ */

// function PhoneLogin({
//   value,
//   onChange,
//   onSubmit,
//   disabled,
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   onSubmit: (event: FormEvent<HTMLFormElement>) => void;
//   disabled: boolean;
// }) {
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">

//       <div>
//         <label
//           htmlFor="phone"
//           className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
//         >
//           Mobile number
//         </label>

//         <div className="flex overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition focus-within:border-[var(--color-primary)] focus-within:ring-4 focus-within:ring-[var(--color-primary)]/10">

//           <div className="flex items-center border-r border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text-secondary)]">
//             +91
//           </div>

//           <input
//             id="phone"
//             type="tel"
//             value={value}
//             onChange={(event) =>
//               onChange(event.target.value)
//             }
//             placeholder="98765 43210"
//             autoFocus
//             required
//             className="
//               h-14
//               min-w-0
//               flex-1
//               bg-transparent
//               px-4
//               text-sm
//               text-[var(--color-text-primary)]
//               outline-none
//               placeholder:text-[var(--color-text-muted)]
//             "
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={disabled || !value}
//         className="
//           flex
//           h-14
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-2xl
//           bg-[var(--color-primary)]
//           text-sm
//           font-bold
//           text-white
//           shadow-[0_8px_20px_rgba(79,125,22,0.20)]
//           transition
//           hover:bg-[var(--color-primary-dark)]
//           hover:shadow-[0_10px_25px_rgba(79,125,22,0.28)]
//           active:scale-[0.99]
//           disabled:cursor-not-allowed
//           disabled:opacity-50
//         "
//       >
//         <Phone size={18} />

//         {disabled ? "Sending OTP..." : "Send OTP"}
//       </button>
//     </form>
//   );
// }

// /* ============================================================
//    EMAIL LOGIN
// ============================================================ */

// function EmailLogin({
//   value,
//   onChange,
//   onSubmit,
//   disabled,
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   onSubmit: (event: FormEvent<HTMLFormElement>) => void;
//   disabled: boolean;
// }) {
//   return (
//     <form onSubmit={onSubmit} className="space-y-5">

//       <div>
//         <label
//           htmlFor="email"
//           className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]"
//         >
//           Email address
//         </label>

//         <div className="flex items-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white px-4 transition focus-within:border-[var(--color-secondary)] focus-within:ring-4 focus-within:ring-[var(--color-secondary)]/10">

//           <Mail
//             size={18}
//             className="shrink-0 text-[var(--color-text-muted)]"
//           />

//           <input
//             id="email"
//             type="email"
//             value={value}
//             onChange={(event) =>
//               onChange(event.target.value)
//             }
//             placeholder="you@example.com"
//             autoFocus
//             required
//             className="
//               h-14
//               min-w-0
//               flex-1
//               bg-transparent
//               px-3
//               text-sm
//               text-[var(--color-text-primary)]
//               outline-none
//               placeholder:text-[var(--color-text-muted)]
//             "
//           />
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={disabled || !value}
//         className="
//           flex
//           h-14
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-2xl
//           bg-[var(--color-primary)]
//           text-sm
//           font-bold
//           text-white
//           shadow-[0_8px_20px_rgba(79,125,22,0.20)]
//           transition
//           hover:bg-[var(--color-primary-dark)]
//           active:scale-[0.99]
//           disabled:cursor-not-allowed
//           disabled:opacity-50
//         "
//       >
//         <Mail size={18} />

//         {disabled ? "Sending OTP..." : "Send OTP"}
//       </button>
//     </form>
//   );
// }

// /* ============================================================
//    OTP VERIFICATION
// ============================================================ */

// function OtpVerification({
//   method,
//   contact,
//   otpValue,
//   onChangeOtp,
//   onKeyDown,
//   onSubmit,
//   onResend,
//   resendTimer,
//   disabled,
// }: {
//   method: Method;
//   contact: string;
//   otpValue: string[];
//   onChangeOtp: (
//     index: number,
//     value: string
//   ) => void;
//   onKeyDown: (
//     index: number,
//     event: React.KeyboardEvent<HTMLInputElement>
//   ) => void;
//   onSubmit: (event: FormEvent<HTMLFormElement>) => void;
//   onResend: () => void;
//   resendTimer: number;
//   disabled: boolean;
// }) {
//   const complete = otpValue.every(Boolean);

//   return (
//     <form onSubmit={onSubmit} className="space-y-6">

//       <div className="rounded-2xl bg-[var(--color-primary-50)] px-4 py-3">

//         <div className="flex items-center gap-3">

//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-primary)] shadow-sm">
//             {method === "phone" ? (
//               <Phone size={17} />
//             ) : (
//               <Mail size={17} />
//             )}
//           </div>

//           <div className="min-w-0">
//             <p className="text-[11px] text-[var(--color-text-muted)]">
//               OTP sent to
//             </p>

//             <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
//               {contact}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div>
//         <label className="mb-3 block text-sm font-semibold text-[var(--color-text-primary)]">
//           Enter 6-digit OTP
//         </label>

//         <div className="grid grid-cols-6 gap-2 sm:gap-3">
//           {otpValue.map((digit, index) => (
//             <input
//               key={index}
//               id={`otp-${index + 1}`}
//               type="text"
//               inputMode="numeric"
//               autoComplete={
//                 index === 0
//                   ? "one-time-code"
//                   : "off"
//               }
//               maxLength={1}
//               value={digit}
//               onChange={(event) =>
//                 onChangeOtp(
//                   index,
//                   event.target.value
//                 )
//               }
//               onKeyDown={(event) =>
//                 onKeyDown(index, event)
//               }
//               className={`
//                 h-12
//                 w-full
//                 rounded-xl
//                 border
//                 bg-white
//                 text-center
//                 text-lg
//                 font-bold
//                 text-[var(--color-text-primary)]
//                 outline-none
//                 transition
//                 ${
//                   digit
//                     ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]"
//                     : "border-[var(--color-border)]"
//                 }
//                 focus:border-[var(--color-primary)]
//                 focus:ring-4
//                 focus:ring-[var(--color-primary)]/10
//               `}
//             />
//           ))}
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={
//           disabled || !complete
//         }
//         className="
//           flex
//           h-14
//           w-full
//           items-center
//           justify-center
//           gap-2
//           rounded-2xl
//           bg-[var(--color-primary)]
//           text-sm
//           font-bold
//           text-white
//           shadow-[0_8px_20px_rgba(79,125,22,0.20)]
//           transition
//           hover:bg-[var(--color-primary-dark)]
//           active:scale-[0.99]
//           disabled:cursor-not-allowed
//           disabled:opacity-50
//         "
//       >
//         <ShieldCheck size={18} />

//         {disabled
//           ? "Verifying..."
//           : "Verify & Continue"}
//       </button>

//       <div className="flex items-center justify-center gap-2 text-xs">

//         <span className="text-[var(--color-text-muted)]">
//           Didn't receive it?
//         </span>

//         <button
//           type="button"
//           onClick={onResend}
//           disabled={
//             resendTimer > 0 || disabled
//           }
//           className="
//             inline-flex
//             items-center
//             gap-1
//             font-semibold
//             text-[var(--color-primary)]
//             transition
//             hover:text-[var(--color-primary-dark)]
//             disabled:cursor-not-allowed
//             disabled:text-[var(--color-text-muted)]
//           "
//         >
//           <RefreshCcw size={13} />

//           {resendTimer > 0
//             ? `Resend in ${resendTimer}s`
//             : "Resend OTP"}
//         </button>
//       </div>

//       <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
//         <CheckCircle2 size={13} />

//         Your login is secure
//       </div>
//     </form>
//   );
// }

"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Mail,
  Phone,
  RefreshCcw,
  ShieldCheck,
  X,
} from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type LoginMethod = "phone" | "email";
type Step = "welcome" | "phone" | "email" | "otp";

export default function LoginModal({
  open,
  onClose,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [method, setMethod] = useState<LoginMethod>("phone");

  const [phoneValue, setPhoneValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const [otpValue, setOtpValue] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* =========================
     RESET WHEN CLOSED
  ========================= */

  useEffect(() => {
    if (!open) {
      setStep("welcome");
      setMethod("phone");
      setOtpValue(["", "", "", "", "", ""]);
      setError("");
      setIsSubmitting(false);
      setResendTimer(30);
    }
  }, [open]);

  /* =========================
     ESC CLOSE
  ========================= */

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

  /* =========================
     RESEND TIMER
  ========================= */

  useEffect(() => {
    if (!open || step !== "otp" || resendTimer <= 0) return;

    const timer = window.setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [open, step, resendTimer]);

  /* =========================
     CLOSE OUTSIDE
  ========================= */

  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  /* =========================
     SELECT LOGIN METHOD
  ========================= */

  const handleSelectMethod = (selected: LoginMethod) => {
    setMethod(selected);
    setStep(selected);
    setError("");
  };

  /* =========================
     SEND OTP
  ========================= */

  const handleSendOtp = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms & Conditions and Privacy Policy."
      );
      return;
    }

    if (method === "phone") {
      if (phoneValue.trim().length < 10) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    if (method === "email") {
      if (!/\S+@\S+\.\S+/.test(emailValue)) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setStep("otp");
      setOtpValue(["", "", "", "", "", ""]);
      setResendTimer(30);

      window.setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }, 700);
  };

  /* =========================
     OTP CHANGE
  ========================= */

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...otpValue];

    next[index] = value.slice(-1);

    setOtpValue(next);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  /* =========================
     OTP BACKSPACE
  ========================= */

  const handleOtpKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      !otpValue[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* =========================
     OTP PASTE
  ========================= */

  const handleOtpPaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setOtpValue(next);

    const focusIndex =
      pasted.length >= 6 ? 5 : pasted.length;

    otpRefs.current[focusIndex]?.focus();
  };

  /* =========================
     VERIFY OTP
  ========================= */

  const handleVerifyOtp = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (otpValue.some((digit) => !digit)) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);

      alert(
        `Login successful!\nRemember me: ${
          rememberMe ? "Yes" : "No"
        }`
      );

      onClose();
    }, 800);
  };

  /* =========================
     RESEND OTP
  ========================= */

  const handleResend = () => {
    if (resendTimer > 0) return;

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setResendTimer(30);
      setOtpValue(["", "", "", "", "", ""]);

      otpRefs.current[0]?.focus();
    }, 600);
  };

  if (!open) return null;

  const contact =
    method === "phone" ? phoneValue : emailValue;

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
        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            {step !== "welcome" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "otp") {
                    setStep(method);
                  } else {
                    setStep("welcome");
                  }

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

                {step === "otp" && "Verify OTP"}
              </h2>

              <p className="text-xs text-[var(--color-text-muted)]">
                {step === "welcome" &&
                  "Sign in to continue ordering"}

                {step === "phone" &&
                  "We'll send a verification code"}

                {step === "email" &&
                  "We'll send an OTP to your email"}

                {step === "otp" &&
                  "Enter the code we sent you"}
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

        {/* ================= BODY ================= */}

        <div className="p-5 sm:p-6">

          {/* =====================================
              WELCOME
          ====================================== */}

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
                onClick={() => handleSelectMethod("phone")}
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

          {/* =====================================
              PHONE / EMAIL FORM
          ====================================== */}

          {(step === "phone" || step === "email") && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              {/* PHONE */}

              {step === "phone" && (
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
                      value={phoneValue}
                      onChange={(e) =>
                        setPhoneValue(e.target.value)
                      }
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
              )}

              {/* EMAIL */}

              {step === "email" && (
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
                      value={emailValue}
                      onChange={(e) =>
                        setEmailValue(e.target.value)
                      }
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

                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    We'll send a 6-digit verification code.
                  </p>
                </div>
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
                disabled={isSubmitting}
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
                {isSubmitting ? (
                  <>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <Phone size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* =====================================
              OTP
          ====================================== */}

          {step === "otp" && (
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

              {/* OTP INPUT */}

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

              {/* VERIFY */}

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

              {/* RESEND */}

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

              {/* REMEMBER */}

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
          )}
        </div>

        {/* ================= FOOTER ================= */}

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
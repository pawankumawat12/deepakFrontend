"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/authSchema";
import type { z } from "zod";

type Values = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const email = useSearchParams().get("email");
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { otp: "" } });
  return <div className="page-content flex min-h-[70vh] items-center justify-center"><section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl"><p className="mb-2 text-xs font-bold tracking-[0.2em] text-lime-700">SFC CAFE</p><h1 className="text-3xl font-bold text-slate-900">Reset password</h1><p className="mt-2 text-slate-500">Enter the 4-digit code sent to {email || "your email"}.</p><form className="mt-7 space-y-4" onSubmit={handleSubmit(() => router.push("/"))}><label className="block text-sm font-semibold text-slate-700">Reset code<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600" inputMode="numeric" maxLength={4} placeholder="1234" {...register("otp")} /></label>{errors.otp && <p className="text-sm text-red-600">{errors.otp.message}</p>}<label className="block text-sm font-semibold text-slate-700">New password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600" type="password" {...register("password")} /></label>{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}<label className="block text-sm font-semibold text-slate-700">Confirm password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600" type="password" {...register("confirmPassword")} /></label>{errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}<button className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800" type="submit">Reset password</button></form><Link className="mt-5 block text-center text-sm font-semibold text-lime-700" href="/">← Back to home</Link></section></div>;
}

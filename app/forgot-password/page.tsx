"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schemas/authSchema";
import type { z } from "zod";

type Values = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(forgotPasswordSchema) });
  return <div className="page-content flex min-h-[70vh] items-center justify-center"><section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl"><p className="mb-2 text-xs font-bold tracking-[0.2em] text-lime-700">SFC CAFE</p><h1 className="text-3xl font-bold text-slate-900">Forgot password?</h1><p className="mt-2 text-slate-500">Enter your email to receive a password reset code.</p><form className="mt-7 space-y-4" onSubmit={handleSubmit(({ email }) => router.push(`/reset-password?email=${encodeURIComponent(email)}`))}><label className="block text-sm font-semibold text-slate-700">Email<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600" type="email" placeholder="you@example.com" {...register("email")} /></label>{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}<button className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800" type="submit">Send reset code</button></form><Link className="mt-5 block text-center text-sm font-semibold text-lime-700" href="/">← Back to home</Link></section></div>;
}

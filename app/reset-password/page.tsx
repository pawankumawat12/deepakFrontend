"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schemas/authSchema";
import {
  useResetPasswordMutation,
  useVerifyResetPasswordTokenMutation,
} from "@/redux/services/authApi";
import type { z } from "zod";

type Values = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [verifyToken] = useVerifyResetPasswordTokenMutation();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const [tokenState, setTokenState] = useState(token ? "checking" : "invalid");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    if (!token) return;
    let active = true;
    verifyToken(token)
      .unwrap()
      .then(() => active && setTokenState("valid"))
      .catch(() => active && setTokenState("invalid"));
    return () => {
      active = false;
    };
  }, [token, verifyToken]);

  const submit = async ({ password }: Values) => {
    if (!token) return;
    try {
      await resetPassword({ accessToken: token, password }).unwrap();
      router.replace("/");
    } catch {
      // The request error is rendered below.
    }
  };

  return (
    <div className="page-content flex min-h-[70vh] items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-lime-700">
          SFC CAFE
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Reset password</h1>
        <p className="mt-2 text-slate-500">
          Choose a new password for your account.
        </p>
        {tokenState === "checking" && (
          <p className="mt-4 text-sm text-slate-500">Verifying reset link…</p>
        )}
        {tokenState === "invalid" && (
          <p className="mt-4 text-sm text-red-600">
            This password reset link is invalid or has expired.
          </p>
        )}
        {tokenState === "valid" && (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)}>
            <label className="block text-sm font-semibold text-slate-700">
              New password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600"
                type="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </label>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <label className="block text-sm font-semibold text-slate-700">
              Confirm password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-lime-600"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
            </label>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">
                {(error as { data?: { message?: string } }).data?.message ||
                  "Unable to reset password"}
              </p>
            )}
            <button
              className="w-full rounded-xl bg-lime-700 px-4 py-3 font-semibold text-white hover:bg-lime-800 disabled:opacity-60"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        )}
        <Link
          className="mt-5 block text-center text-sm font-semibold text-lime-700"
          href="/"
        >
          ← Back to home
        </Link>
      </section>
    </div>
  );
}

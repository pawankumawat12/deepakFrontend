"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldAlert,
  Send,
  LoaderCircle,
  CheckCircle,
  MessageSquare,
  LogOut,
  Mail,
  User as UserIcon,
  Phone,
  HelpCircle,
} from "lucide-react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  useSubmitBlockedSupportRequestMutation,
  useLogoutMutation,
  useLazyGetMeQuery,
} from "../redux/services/authApi";
import { setCredentials, logout } from "../redux/features/authSlice";
import { RootState } from "../redux/store";

export default function BlockedAccountScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [submitRequest, { isLoading: isSubmitting }] =
    useSubmitBlockedSupportRequestMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [getMe] = useLazyGetMeQuery();

  // Socket.IO real-time listener for instant unblock
  useEffect(() => {
    if (!user?.id) return;
    const socketUrl = (
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
      process.env.VITE_BACKEND_URL ||
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
      ""
    ).replace(/\/+$/, "");
    const socket = io(socketUrl, {
      query: { userId: user.id, role: user.role || "user" },
      transports: ["websocket", "polling"],
    });

    socket.on("customer_status_changed", async (data) => {
      if (data?.is_blocked === false || data?.is_active === true) {
        toast.success(
          "Your account has been unblocked by the administrator! Restoring access..."
        );
        try {
          const freshUser = await getMe().unwrap();
          dispatch(setCredentials(freshUser));
        } catch {
          window.location.reload();
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, user?.role, dispatch, getMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message for the admin.");
      return;
    }

    try {
      await submitRequest({
        email: user?.email || "",
        name: user?.name || "Customer",
        phone: user?.phone || undefined,
        message: message.trim(),
      }).unwrap();

      setSubmitted(true);
      toast.success("Your request has been sent to the admin. We will review it shortly.");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {}
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-900/90 p-4 backdrop-blur-md">
      <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900 text-white shadow-2xl md:grid-cols-2">
        {/* LEFT PANEL: BLOCKED STATUS & DETAILS */}
        <div className="flex flex-col justify-between border-b border-slate-800 p-8 md:border-b-0 md:border-r">
          <div>
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 ring-8 ring-red-500/5">
              <ShieldAlert size={36} />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
              Account Suspended
            </span>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Your Account Has Been Blocked
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Access to your SFC Cafe account has been deactivated by the
              administrator. You cannot place orders or access account services
              while blocked.
            </p>

            {/* BLOCK REASON BOX */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Reason from Administrator
              </div>
              <p className="mt-1.5 text-sm font-medium text-slate-200">
                "{user?.block_reason || "Account deactivated by administrator."}"
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <LogOut size={16} />
              <span>Sign Out & Switch Account</span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: CONTACT ADMIN / UNBLOCK REQUEST FORM */}
        <div className="flex flex-col justify-between bg-slate-950/80 p-8">
          <div>
            <div className="flex items-center gap-2 text-lime-400">
              <MessageSquare size={20} />
              <h2 className="text-lg font-bold text-white">Contact Admin</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Submit an appeal or request to have your account reviewed and
              unblocked. The administrator will be notified instantly.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
                <CheckCircle size={40} className="mx-auto text-emerald-400" />
                <h3 className="mt-3 text-base font-bold text-emerald-300">
                  Request Submitted Successfully
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  Your message has been dispatched to the admin dashboard. Once
                  the administrator approves your request, this screen will
                  unlock automatically in real-time.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* USER INFO READONLY */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400">
                      Your Name
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-300">
                      <UserIcon size={14} className="text-slate-500" />
                      <span className="truncate">{user?.name || "Customer"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400">
                      Email
                    </label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-300">
                      <Mail size={14} className="text-slate-500" />
                      <span className="truncate">{user?.email || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* MESSAGE INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Message / Explanation
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or explain why your account should be unblocked..."
                    className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-lime-500 focus:ring-1 focus:ring-lime-500/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition hover:bg-lime-400 active:scale-[0.99] disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <LoaderCircle size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Request to Admin</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle size={14} />
            <span>Need urgent help? Reach us at support@sfccafe.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}


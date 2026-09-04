"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetFooterQuery } from "@/redux/services/settingsApi";
import {
  useSubmitContactQueryMutation,
  useGetMyContactQueriesQuery,
} from "@/redux/services/contactApi";
import { getSocket } from "@/lib/socket";

export default function ContactPage() {
  const user = useSelector((state: any) => state.auth?.user);
  const { data: settings } = useGetFooterQuery();
  const settingData = settings?.data;

  const [activeTab, setActiveTab] = useState<"form" | "threads">("form");

  const [submitQuery, { isLoading }] = useSubmitContactQueryMutation();
  const {
    data: myQueriesData,
    isLoading: loadingMyQueries,
    isFetching: fetchingMyQueries,
    refetch: refetchQueries,
  } = useGetMyContactQueriesQuery(undefined, {
    skip: !user,
  });

  const myQueries = myQueriesData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Listen to real-time socket events when an admin replies to customer inquiry
  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket(user.id);
    const handleReply = (updatedQuery: any) => {
      refetchQueries();
      toast.success(
        `Support responded to your inquiry: "${updatedQuery?.subject || "Inquiry"}"`
      );
    };
    socket.on("contact_query_replied", handleReply);
    return () => {
      socket.off("contact_query_replied", handleReply);
    };
  }, [user?.id, refetchQueries]);

  // Pre-fill with authenticated user details
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject");
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter your message");
      return;
    }

    try {
      const response = await submitQuery(formData).unwrap();
      toast.success(response.message || "Message sent successfully!");
      setSubmitted(true);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to send message. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  }


  const socialLinks = [
    {
      name: "Instagram",
      url: settingData?.instagram,
      icon: FaInstagram,
      size: 19,
    },
    {
      name: "Facebook",
      url: settingData?.facebook,
      icon: FaFacebookF,
      size: 17,
    },
    {
      name: "Twitter",
      url: settingData?.twitter,
      icon: FaTwitter,
      size: 17,
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Location */}

          <div
            className="
              group
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                group-hover:bg-[var(--color-primary)]
                group-hover:text-white
              "
            >
              <MapPin size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Visit Us
            </h3>

            <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
              {settingData?.location}
              <br />
            </p>

          </div>

          {/* Phone */}

          <div
            className="
              group
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                group-hover:bg-[var(--color-primary)]
                group-hover:text-white
              "
            >
              <Phone size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Call Us
            </h3>

            <a
              href="tel:+919999999999"
              className="mt-2 block text-xs leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              {settingData?.phone_number}

            </a>

          </div>

          {/* Email */}

          <div
            className="
              group
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                group-hover:bg-[var(--color-primary)]
                group-hover:text-white
              "
            >
              <Mail size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Email Us
            </h3>

            <a
              href="mailto:hello@sfccafe.com"
              className="mt-2 block break-all text-xs leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            >
              {settingData?.email}

            </a>

          </div>

          {/* Hours */}

          <div
            className="
              group
              rounded-3xl
              border
              border-[var(--color-border)]
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                transition
                group-hover:bg-[var(--color-primary)]
                group-hover:text-white
              "
            >
              <Clock3 size={21} />
            </div>

            <h3 className="mt-5 text-sm font-black text-[var(--color-text-primary)]">
              Opening Hours
            </h3>

            <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
              {settingData?.working_hours}
            </p>

          </div>

        </div>

      </section>

      {/* =========================================================
          CONTACT FORM + LOCATION
      ========================================================= */}

      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 md:pb-20">

        <div className="grid overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-sm lg:grid-cols-2">

          {/* LEFT - FORM */}

          <div className="p-6 sm:p-8 md:p-10">
            {/* Tab Navigation */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeTab === "form"
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--bg-body)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Send size={13} />
                  <span>Send a Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("threads")}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                    activeTab === "threads"
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--bg-body)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <MessageCircle size={13} />
                  <span>My Messages</span>
                  {user && myQueries.length > 0 && (
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                        activeTab === "threads"
                          ? "bg-white/20 text-white"
                          : "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                      }`}
                    >
                      {myQueries.length}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === "threads" && user && (
                <button
                  type="button"
                  onClick={() => refetchQueries()}
                  disabled={fetchingMyQueries}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--bg-body)]"
                  title="Refresh inquiries"
                >
                  <RefreshCw size={12} className={fetchingMyQueries ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
              )}
            </div>

            {/* TAB 1: FORM */}
            {activeTab === "form" && (
              <div>
                <div className="mb-7">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Send a Message
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[var(--color-text-primary)] sm:text-3xl">
                    How can we help?
                  </h2>
                  <p className="mt-2 text-xs leading-6 text-[var(--color-text-secondary)]">
                    Drop us a message and we'll get back to you as soon as possible.
                  </p>
                </div>

                {submitted ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-emerald-950">
                      Message Sent Successfully!
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-emerald-700">
                      Thank you for reaching out to SFC Cafe. Our team has received your inquiry and will respond to you shortly via email or phone.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setActiveTab("threads");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] active:scale-95"
                      >
                        <MessageCircle size={14} />
                        <span>View Inquiries & Responses</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-95"
                      >
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                      >
                        Your Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--color-border)]
                          bg-[var(--bg-body)]
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[var(--color-text-muted)]
                          focus:border-[var(--color-primary)]
                          focus:ring-2
                          focus:ring-[var(--color-primary)]/10
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                        >
                          Email Address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          disabled={isLoading}
                          readOnly={Boolean(user?.email)}
                          className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            bg-[var(--bg-body)]
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            placeholder:text-[var(--color-text-muted)]
                            focus:border-[var(--color-primary)]
                            focus:ring-2
                            focus:ring-[var(--color-primary)]/10
                            disabled:opacity-60
                          "
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          disabled={isLoading}
                          readOnly={Boolean(user?.phone)}
                          className="
                            w-full
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            bg-[var(--bg-body)]
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            placeholder:text-[var(--color-text-muted)]
                            focus:border-[var(--color-primary)]
                            focus:ring-2
                            focus:ring-[var(--color-primary)]/10
                            disabled:opacity-60
                          "
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                      >
                        Subject *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Catering inquiry, feedback, order assistance"
                        disabled={isLoading}
                        className="
                          w-full
                          rounded-xl
                          border
                          border-[var(--color-border)]
                          bg-[var(--bg-body)]
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[var(--color-text-muted)]
                          focus:border-[var(--color-primary)]
                          focus:ring-2
                          focus:ring-[var(--color-primary)]/10
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="mb-1.5 block text-xs font-bold text-[var(--color-text-primary)]"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind or how we can assist you..."
                        disabled={isLoading}
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          border
                          border-[var(--color-border)]
                          bg-[var(--bg-body)]
                          px-4
                          py-3
                          text-sm
                          outline-none
                          transition
                          placeholder:text-[var(--color-text-muted)]
                          focus:border-[var(--color-primary)]
                          focus:ring-2
                          focus:ring-[var(--color-primary)]/10
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--color-primary)]
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        text-white
                        shadow-md
                        transition
                        hover:bg-[var(--color-primary-dark)]
                        hover:-translate-y-0.5
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isLoading ? (
                        <>
                          <LoaderCircle size={16} className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: CONVERSATION THREADS */}
            {activeTab === "threads" && (
              <div>
                <div className="mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    Inquiry History
                  </span>
                  <h2 className="mt-1 text-xl font-black text-[var(--color-text-primary)] sm:text-2xl">
                    Your Inquiries & Responses
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    Track questions submitted to our team and view official replies.
                  </p>
                </div>

                {!user ? (
                  <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--bg-body)]/50 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                      <MessageCircle size={22} />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-[var(--color-text-primary)]">
                      Sign In to View Your Messages
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                      Log in to your account to view your conversation history and replies from our customer support team.
                    </p>
                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--color-primary-dark)] transition"
                    >
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : loadingMyQueries ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-muted)]">
                    <LoaderCircle size={28} className="animate-spin text-[var(--color-primary)]" />
                    <p className="mt-3 text-xs font-medium">Loading your conversations...</p>
                  </div>
                ) : myQueries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--bg-body)]/50 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                      <MessageCircle size={22} />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-[var(--color-text-primary)]">
                      No Inquiries Yet
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
                      You haven't submitted any inquiries yet. If you have questions about catering, orders, or anything else, let us know!
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("form")}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--color-primary-dark)] transition"
                    >
                      <Send size={13} />
                      <span>Send a Message</span>
                    </button>
                  </div>
                ) : (
                  <div className="max-h-[560px] overflow-y-auto space-y-4 pr-1">
                    {myQueries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm transition hover:border-[var(--color-primary)]/30"
                      >
                        {/* Header: Subject, Date, Status */}
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-100 pb-3">
                          <div>
                            <h4 className="text-sm font-extrabold text-[var(--color-text-primary)]">
                              {inquiry.subject}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                              Submitted on {new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <div>
                            {inquiry.admin_reply ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                                <CheckCircle2 size={12} /> Replied
                              </span>
                            ) : inquiry.status === "in_progress" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                                <Clock3 size={12} /> In Progress
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                                <AlertCircle size={12} /> Under Review
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer's Query */}
                        <div className="mt-3 rounded-xl bg-[var(--bg-body)] p-3.5 text-xs text-[var(--color-text-secondary)]">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                            Your Message
                          </p>
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>

                        {/* Admin's Response Thread */}
                        {inquiry.admin_reply ? (
                          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
                              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                                <ShieldCheck size={14} className="text-emerald-700" />
                                <span>Support Team Response</span>
                                {inquiry.admin_responder_name && (
                                  <span className="text-[11px] font-semibold text-emerald-800">
                                    • {inquiry.admin_responder_name}
                                  </span>
                                )}
                              </div>
                              {inquiry.replied_at && (
                                <span className="text-[10px] font-medium text-emerald-700">
                                  {new Date(inquiry.replied_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-xs leading-relaxed text-emerald-950 whitespace-pre-wrap">
                              {inquiry.admin_reply}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-amber-200 bg-amber-50/60 p-3 text-[11.5px] text-amber-800">
                            <Clock3 size={13} className="shrink-0 text-amber-600" />
                            <span>Our support team is reviewing your query. You will receive an update here and via email shortly.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="relative min-h-[520px]">
            <div
              className="
                absolute
                inset-0
                opacity-20
                [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
                [background-size:50px_50px]
              "
            />

            {/* Location content */}

            <div className="relative flex h-full flex-col justify-between p-7 sm:p-10">

              <div>

                <span className="text-[10px] py-1 px-3 rounded-full font-bold uppercase tracking-[0.2em] text-[var(--color-primary-light)] bg-[var(--color-primary-50)]">
                  Find Us
                </span>

                <h2 className="mt-3 text-3xl font-black ">
                  Come say
                  <br />
                  <span className="text-[var(--color-primary-light)]">
                    hello
                  </span>
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 ">
                  We're always happy to welcome you. Drop by for
                  some delicious food and good vibes.
                </p>

              </div>

              {/* Map pin */}

              <div className="flex flex-1 items-center justify-center">

                <div className="relative">

                  <div
                    className="
                      absolute
                      -inset-8
                      animate-pulse
                      rounded-full
                      bg-[var(--color-primary)]/10
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--color-primary)]
                      text-white
                      shadow-[0_15px_40px_rgba(0,0,0,0.3)]
                    "
                  >
                    <MapPin size={34} />
                  </div>

                </div>

              </div>

              {/* Address card */}

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  backdrop-blur-md
                "
              >

                <div className="flex gap-4">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[var(--color-primary)]
                      text-white
                    "
                  >
                    <MapPin size={18} />
                  </div>

                  <div>

                    <p className="text-xs font-bold ">
                      SFC Cafe
                    </p>

                    <p className="mt-1 text-xs leading-5">
                      {settingData?.location}
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Follow & Connect
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--color-text-primary)]">
            Stay connected with SFC
          </h2>
          <div className="mt-6 flex justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-light)]
                  text-white/70
                  transition
                  hover:bg-[var(--color-primary)]
                  hover:text-white"

                >
                  <Icon size={social.size} />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
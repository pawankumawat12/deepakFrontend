"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CmsPage, useGetCmsPageBySlugQuery } from "@/redux/services/cmsApi";
import CmsContentRenderer from "./CmsContentRenderer";

interface CmsPageViewProps {
  slug: string;
  initialData?: CmsPage | null;
}

export default function CmsPageView({ slug, initialData }: CmsPageViewProps) {
  const { data: queryData, isLoading, isError } = useGetCmsPageBySlugQuery(slug, {
    skip: Boolean(initialData),
  });

  const page = initialData || queryData?.data;

  // Skeleton Loading State
  if (isLoading && !page) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 rounded bg-gray-200 skeleton-pulse mb-6" />

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-10 shadow-sm mb-6">
            <div className="h-8 w-3/4 rounded-lg bg-gray-200 skeleton-pulse mb-4" />
            <div className="h-4 w-40 rounded bg-gray-100 skeleton-pulse" />
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-10 shadow-sm space-y-4">
            <div className="h-5 w-full rounded bg-gray-100 skeleton-pulse" />
            <div className="h-5 w-5/6 rounded bg-gray-100 skeleton-pulse" />
            <div className="h-5 w-4/6 rounded bg-gray-100 skeleton-pulse" />
            <div className="h-32 w-full rounded-xl bg-gray-100 skeleton-pulse my-6" />
            <div className="h-5 w-full rounded bg-gray-100 skeleton-pulse" />
            <div className="h-5 w-3/4 rounded bg-gray-100 skeleton-pulse" />
          </div>
        </div>
      </main>
    );
  }

  // Not Found / Error State
  if (!page) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[var(--bg-body)] px-4 py-16">
        <div className="max-w-md w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
            <FileText size={26} />
          </div>
          <h1 className="mt-5 text-2xl font-black text-[var(--color-text-primary)]">
            Page Not Available
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            The page you are looking for does not exist, has been unpublished, or is temporarily offline.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              <Home size={16} /> Home
            </Link>
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} /> Explore Menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const updatedDate = page.updatedAt
    ? new Date(page.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[var(--bg-body)] py-8 sm:py-12">
      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition hover:text-[var(--color-primary)]"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} className="text-gray-400" />
          <span className="truncate text-[var(--color-text-primary)] font-semibold">
            {page.title}
          </span>
        </nav>

        {/* Hero Header Card */}
        <header className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-10 shadow-sm mb-6">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-50)] px-3 py-1 text-xs font-bold text-[var(--color-primary)] mb-3">
              <ShieldCheck size={14} />
              <span>SFC Bakers Official</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
              {page?.title}
            </h1>

            {updatedDate && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <Calendar size={13} className="text-gray-400" />
                <span>Last updated: {updatedDate}</span>
              </div>
            )}
          </div>

          {/* Decorative background glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--color-primary)]/5" />
        </header>

        {/* Page Content Card */}
        <article className="rounded-3xl border border-[var(--color-border)] bg-white p-6 sm:p-10 shadow-sm">
          <CmsContentRenderer content={page.content || ""} />
        </article>

        {/* Help & Support CTA */}
        <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-[var(--color-primary)]" />
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">
                Have questions regarding this page?
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Our customer happiness team is available to assist with any questions or order queries.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
            >
              <MessageCircle size={15} />
              <span>Contact Support</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}


import Link from "next/link";
import { ArrowLeft, Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-body)] px-4">
      <section className="max-w-md rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
          <Utensils size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-[var(--color-text-primary)]">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          The page or item you requested is unavailable.
        </p>
        <Link href="/menu" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]">
          <ArrowLeft size={16} /> Back to menu
        </Link>
      </section>
    </main>
  );
}

import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
        <WifiOff size={36} />
      </div>

      <h1 className="mt-6 text-2xl font-black text-[var(--color-text-primary)]">
        You&apos;re offline
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
        Check your internet connection and try again. Previously visited pages
        may still be available.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
      >
        Go to Home
      </Link>
    </div>
  );
}

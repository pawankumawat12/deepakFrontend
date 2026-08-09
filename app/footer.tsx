import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--bg-footer)] text-[var(--color-cream)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_0.8fr] md:px-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]/90">Contact</p>
          <p className="text-sm text-[var(--color-cream)]/80">Need help with an order or want to partner with us? Reach out anytime.</p>
          <div className="space-y-1 text-sm text-[var(--color-cream)]/80">
            <p>📍 12 Baker Street, Sweet City</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ hello@bakingo.com</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]/90">Subscribe</p>
          <p className="text-sm text-[var(--color-cream)]/80">Get bakery updates, fresh deals, and exclusive offers in your inbox.</p>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 w-full rounded-3xl border border-[var(--color-border)] bg-[var(--bg-body)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
            />
            <button
              type="submit"
              className="h-12 rounded-3xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-white)] transition hover:bg-[var(--color-primary-dark)]"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)]/90">Legal</p>
          <div className="grid gap-2 text-sm text-[var(--color-cream)]/80">
            <a href="/terms" className="transition hover:text-[var(--color-white)]">Terms of Service</a>
            <a href="/privacy" className="transition hover:text-[var(--color-white)]">Privacy Policy</a>
            <a href="/faq" className="transition hover:text-[var(--color-white)]">FAQs</a>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(255,255,255,0.08)] px-4 py-4 text-center text-xs text-[var(--color-cream)]/70 md:px-6">
        <p>© 2026 Bakingo-inspired bakery app. Designed for mobile-first bakery browsing.</p>
      </div>
    </footer>
  );
};

export default Footer;
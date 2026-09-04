import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  UserCheck,
  Bell,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SFC Cafe",
  description: "Read the Privacy Policy of SFC Cafe to understand how we collect, protect, and use your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 1, 2026";

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            When you visit our website, register an account, browse the menu, or place an order with SFC Cafe, we collect information necessary to deliver fresh food and an exceptional dining experience:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Personal Identification:</strong> Your full name, email address, and phone number provided during account registration and checkout.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Delivery Address & Location:</strong> House/flat number, street name, landmark, city, state, postal code, and optional GPS coordinates to calculate delivery distance and ensure prompt doorstep delivery.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Order History & Preferences:</strong> Past orders, favorite menu items, dietary preferences, special cooking instructions, applied promo codes, and product reviews.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Device & Technical Data:</strong> Browser type, operating system, IP address, and cookie tokens to maintain your login session and cart state.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "usage",
      icon: Eye,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We use the personal information collected for the following legitimate business purposes:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Order Fulfillment:</strong> Processing your order, preparing food in the kitchen, and dispatching to your delivery address.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Live Order Updates:</strong> Sending real-time order status notifications, delivery partner tracking, and OTP verifications via SMS or Email.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Customer Support & In-App Chat:</strong> Responding to inquiries, resolving order concerns, and processing refund or cancellation requests.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Personalized Offers:</strong> Suggesting relevant deals, combos, and seasonal discounts based on your preferences.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Payment & Data Security",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Your payment security is our top priority:
          </p>
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--color-border)] bg-stone-50/70 p-4">
            <Lock size={16} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            <p className="text-xs font-semibold leading-relaxed text-[var(--color-text-primary)]">
              <strong>Zero Card Credential Storage:</strong> SFC Cafe does not store your debit card, credit card, net banking credentials, or UPI PINs on our servers. All digital payments and UPI QR scans are processed securely via RBI-authorized payment gateways complying with PCI-DSS standards.
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We use industry-standard SSL/TLS encryption, secure database hashing (bcrypt for passwords), and strict access control mechanisms to prevent unauthorized access, disclosure, or data loss.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      icon: UserCheck,
      title: "4. Information Sharing & Third Parties",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We respect your privacy and <strong>never sell or rent your personal data</strong> to third-party advertisers. We only share necessary information with trusted partners strictly required for service delivery:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Delivery Partners:</strong> Sharing your name, contact phone number, and delivery address to complete order delivery.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Transactional Email & SMS Services:</strong> Secure communication providers used solely for OTP delivery and order receipts.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Legal Requirements:</strong> Disclosing information only when mandated by applicable law, court order, or governmental authorities.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "rights",
      icon: ShieldCheck,
      title: "5. Your Rights & Account Control",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            As a registered customer of SFC Cafe, you retain complete control over your personal information:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Access & Edit:</strong> You can view and update your name, phone number, saved delivery addresses, and password anytime via your <Link href="/profile" className="font-semibold text-[var(--color-primary)] underline">Profile Dashboard</Link>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Review Management:</strong> You can edit or delete your own product reviews and ratings directly on the respective product details page.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Account Deletion:</strong> You can request complete deletion of your account and personal records by contacting our privacy team.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "contact",
      icon: Mail,
      title: "6. Contact Our Privacy Team",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-stone-50/70 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[var(--color-text-muted)]">Email Us</p>
                <a href="mailto:support@sfccafe.com" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                  support@sfccafe.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-stone-50/70 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[var(--color-text-muted)]">Customer Helpline</p>
                <a href="tel:+917680939596" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                  +91 76809 39596
                </a>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg-body)] pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-white py-12 md:py-16">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-primary)]/10" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[var(--color-cheese)]/10" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Legal & Transparency
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            We are committed to safeguarding your privacy and ensuring your personal information is protected. This policy explains what data we collect, how we protect it, and your rights.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
            <FileText size={14} className="text-[var(--color-primary)]" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* STICKY QUICK NAVIGATION */}
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-stone-50 hover:text-[var(--color-primary)]"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN POLICY CONTENT */}
          <div className="space-y-6">
            {sections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-24 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                      <IconComp size={20} />
                    </div>
                    <h2 className="text-base font-black text-[var(--color-text-primary)] sm:text-lg">
                      {sec.title}
                    </h2>
                  </div>

                  {sec.content}
                </div>
              );
            })}

            {/* FOOTER CALLOUT */}
            <div className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-primary-50)]/50 p-6 text-center">
              <ShieldCheck size={28} className="mx-auto text-[var(--color-primary)]" />
              <h4 className="mt-2 text-sm font-black text-[var(--color-text-primary)]">
                Have questions about our privacy practices?
              </h4>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                We're always here to help. Reach out to our dedicated support desk anytime.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  Contact Support
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] transition hover:bg-stone-50"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckSquare,
  Utensils,
  Truck,
  CreditCard,
  Tag,
  AlertTriangle,
  Scale,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export const metadata = {
  title: "Terms and Conditions | SFC Cafe",
  description: "Read the Terms and Conditions for ordering food, using our services, promo codes, and dining with SFC Cafe.",
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "September 1, 2026";

  const sections = [
    {
      id: "agreement",
      icon: Scale,
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Welcome to <strong>SFC Cafe</strong>. By accessing our website, mobile progressive web app (PWA), creating an account, or placing an order for food delivery or takeout, you agree to be bound by these Terms and Conditions and our Privacy Policy.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            If you do not agree with any portion of these terms, please do not access or use our services. We reserve the right to modify these terms at any time with updated timestamps posted on this page.
          </p>
        </>
      ),
    },
    {
      id: "account",
      icon: CheckSquare,
      title: "2. Account Registration & Security",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            To place orders and access order tracking history, you may register an account using your email and phone number:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Accuracy of Information:</strong> You must provide accurate, current, and complete information including a valid delivery address and phone number for contact upon arrival.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Account Confidentiality:</strong> You are responsible for safeguarding your login credentials and OTPs. SFC Cafe will never ask for your password or OTP over the phone.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <span><strong>Suspension for Misuse:</strong> We reserve the right to suspend or terminate accounts that engage in fraudulent orders, harassment of delivery partners, or abuse of promo codes.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "ordering",
      icon: Utensils,
      title: "3. Food Ordering, Menu & Pricing",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            All menu items, descriptions, and prices displayed on our website are subject to availability:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Fresh & Made-to-Order:</strong> Most meals and beverages are freshly prepared upon receipt of your order to ensure peak taste and hygiene.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Pricing & Taxes:</strong> All item prices are listed in Indian Rupees (₹). GST taxes, packaging fees, platform fees, and delivery charges are calculated transparently and shown before final order placement.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Item Substitutions:</strong> If a specific item or ingredient is unexpectedly unavailable, our support team will contact you via in-app chat or phone before fulfilling your order.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "delivery",
      icon: Truck,
      title: "4. Delivery & Doorstep Guidelines",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We strive to deliver your fresh meals within the estimated delivery time window:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Delivery Radius:</strong> We deliver within our specified operating radius from the SFC Cafe kitchen in Jaipur.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Customer Availability:</strong> Please ensure your phone is reachable when the delivery partner arrives at your address. If a customer is unreachable for more than 10 minutes upon arrival, the order may be marked undeliverable without refund.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>External Delays:</strong> Delivery times are estimates and may be affected by extreme weather, peak traffic, road closures, or public holidays.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cod",
      icon: CreditCard,
      title: "5. Cash on Delivery (COD) & Payment Rules",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We offer convenient payment options including Cash on Delivery (COD) and doorstep UPI scan:
          </p>
          <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-700" />
            <p className="text-xs font-semibold leading-relaxed text-amber-900">
              <strong>COD Commitment:</strong> When placing a Cash on Delivery order, you commit to accepting and paying for the order upon arrival. Placing fraudulent COD orders or repeatedly refusing doorstep delivery will result in permanent blacklisting of your phone number and address.
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            For online prepayments, transactions are processed securely through RBI-approved gateways.
          </p>
        </>
      ),
    },
    {
      id: "offers",
      icon: Tag,
      title: "6. Promotional Offers, Coupons & BOGO Deals",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            SFC Cafe offers dynamic promotional deals, percentage discounts, flat rebates, and Buy-One-Get-One (BOGO) offers:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Minimum Order Thresholds:</strong> Offers requiring a minimum cart value apply only to the qualifying item subtotal before taxes and fees.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Usage Limits & Expiration:</strong> Promo codes with usage caps or validity date ranges are enforced by our backend system. Expired codes cannot be redeemed retroactively.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Non-Stackable:</strong> Only one promo code may be applied per order unless specified as an automatic store discount.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "allergens",
      icon: AlertTriangle,
      title: "7. Food Safety, Ingredients & Allergens",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We take pride in maintaining strict hygiene and quality standards. However, please note:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Our kitchen handles dairy, gluten, soy, nuts, and spices. If you have severe food allergies, please specify in the order notes or contact our cafe staff before placing your order. SFC Cafe cannot guarantee complete absence of airborne cross-contamination in shared preparation areas.
          </p>
        </>
      ),
    },
    {
      id: "jurisdiction",
      icon: ShieldAlert,
      title: "8. Governing Law & Dispute Resolution",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to our services shall be subject to the exclusive jurisdiction of the courts in <strong>Jaipur, Rajasthan, India</strong>.
          </p>
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
              Customer Agreement
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            Please review these terms and conditions carefully before placing orders or using the SFC Cafe platform.
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
          {/* STICKY TABLE OF CONTENTS */}
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

          {/* MAIN TERMS CONTENT */}
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

            {/* QUICK LINK FOOTER */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 text-center shadow-sm">
              <h4 className="text-sm font-black text-[var(--color-text-primary)]">
                Related Legal Documents
              </h4>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Check our detailed policies on privacy and cancellation & refunds.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-stone-50 px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] transition hover:bg-stone-100"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/refund-policy"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  Refund & Cancellation Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


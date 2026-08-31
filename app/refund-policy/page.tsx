import React from "react";
import Link from "next/link";
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  CreditCard,
  MessageSquare,
  Phone,
  Mail,
  AlertCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | SFC Cafe",
  description: "Learn about SFC Cafe's transparent refund, cancellation, return, and reimbursement policies.",
};

export default function RefundPolicyPage() {
  const lastUpdated = "September 1, 2026";

  const sections = [
    {
      id: "cancellation",
      icon: Clock,
      title: "1. Order Cancellation Policy",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Because our meals are prepared fresh and made-to-order, cancellation windows are strictly time-sensitive:
          </p>
          <div className="mt-3 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-950">Immediate Cancellation (Within 1-2 Minutes)</p>
                <p className="text-xs text-emerald-800 mt-0.5">
                  You may cancel your order free of charge immediately after placement if the kitchen has not yet started preparing the food.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <AlertCircle size={20} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-950">Once Order Status is "Preparing" or "Out for Delivery"</p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Once food preparation is underway or the meal has been handed over to the delivery partner, cancellation is no longer possible to avoid food wastage.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "eligibility",
      icon: CheckCircle2,
      title: "2. When are You Eligible for a Full or Partial Refund?",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            We hold ourselves to high quality standards. You are entitled to a full or partial refund in the following verified circumstances:
          </p>
          <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Missing Items:</strong> If one or more items from your placed order are missing from the delivery package upon arrival.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Damaged or Spilled Food:</strong> If containers were severely damaged, broken, or heavily spilled during transit making the food inedible.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Wrong Item Delivered:</strong> If you received an entirely different meal or beverage than what you ordered.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
              <span><strong>Kitchen Cancellation:</strong> If SFC Cafe cancels your order due to unavailable ingredients, kitchen emergencies, or sudden store closure.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "non-refundable",
      icon: XCircle,
      title: "3. Non-Refundable Scenarios",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Refunds will <strong>not</strong> be approved under the following conditions:
          </p>
          <ul className="mt-3 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <span><strong>Incorrect Address / Phone Number:</strong> Delivery failure caused by incorrect address or unreachability of the recipient after the delivery partner reaches the destination.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <span><strong>Personal Taste Preference:</strong> Subjective taste dissatisfaction when the food was prepared according to our standard recipe and ingredients.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <span><strong>Delayed Claims:</strong> Damage, spill, or missing item complaints submitted more than 30 minutes after order delivery.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "processing",
      icon: CreditCard,
      title: "4. Refund Modes & Processing Timelines",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Once your refund claim is approved by our support team, the funds are credited back through the original payment mode:
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--color-border)] bg-stone-50 font-bold uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Refund Channel</th>
                  <th className="p-3.5">Processing Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-primary)]">
                <tr>
                  <td className="p-3.5 font-semibold">UPI (GPay, PhonePe, Paytm)</td>
                  <td className="p-3.5">Original UPI VPA / Account</td>
                  <td className="p-3.5 font-bold text-emerald-600">24 – 48 Hours</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Debit / Credit Card</td>
                  <td className="p-3.5">Original Card Account</td>
                  <td className="p-3.5 font-bold text-emerald-600">3 – 5 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Net Banking</td>
                  <td className="p-3.5">Source Bank Account</td>
                  <td className="p-3.5 font-bold text-emerald-600">3 – 7 Business Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold">Cash on Delivery (COD)</td>
                  <td className="p-3.5">Direct UPI Transfer or Store Credit</td>
                  <td className="p-3.5 font-bold text-emerald-600">Instant / Within 24h</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "how-to-request",
      icon: MessageSquare,
      title: "5. How to Submit a Refund or Quality Complaint",
      content: (
        <>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            If you encounter an issue with your order, reporting it is fast and simple:
          </p>
          <ol className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">1</span>
              <span>Go to your <Link href="/orders" className="font-semibold text-[var(--color-primary)] underline">My Orders</Link> page and click on the affected order.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">2</span>
              <span>Open the <strong>Order Chat</strong> to message our support desk in real-time or share clear photographs of damaged packaging/food.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-white">3</span>
              <span>Our support team will review your ticket within 15 minutes and immediately initiate a replacement meal or refund.</span>
            </li>
          </ol>

          <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-stone-50/70 p-4">
            <p className="text-xs font-bold text-[var(--color-text-primary)]">Direct Customer Care Helpline:</p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Call us directly at <a href="tel:+917680939596" className="font-bold text-[var(--color-primary)] underline">+91 76809 39596</a> or email <a href="mailto:support@sfccafe.com" className="font-bold text-[var(--color-primary)] underline">support@sfccafe.com</a> with your Order Number.
            </p>
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
              Customer Protection
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black text-[var(--color-text-primary)] sm:text-4xl">
            Refund & Cancellation Policy
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-secondary)]">
            We aim for 100% customer satisfaction. Read our clear guidelines on order cancellations, quality guarantees, and refund timelines.
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

            {/* CALL TO ACTION */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 text-center shadow-sm">
              <RotateCcw size={28} className="mx-auto text-[var(--color-primary)]" />
              <h4 className="mt-2 text-sm font-black text-[var(--color-text-primary)]">
                Need assistance with a recent order?
              </h4>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                View your order history to chat directly with our team or contact support.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  Go to My Orders
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-stone-50 px-4 py-2 text-xs font-bold text-[var(--color-text-primary)] transition hover:bg-stone-100"
                >
                  Contact Helpdesk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


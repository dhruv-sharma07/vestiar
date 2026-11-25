import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service: FitIQ",
  description: "Terms and conditions governing the use of FitIQ wardrobe cataloging and occasion styling services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#E5E8CE] text-[#202D1F]">
      {/* Editorial Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#CAD2B4] bg-[#E5E8CE]/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#586B56] hover:text-[#202D1F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Atelier</span>
          </Link>

          <Link href="/" className="font-serif text-lg font-normal tracking-tight text-[#202D1F]">
            VESTIAR
          </Link>
        </div>
      </nav>

      {/* Main Document Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="border-b border-[#CAD2B4] pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EFF2E1] text-[#789575]">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              User Agreement
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
            Terms of Service
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Effective Date: November 22, 2026. Last updated: November 2026.
          </p>
        </div>

        <div className="space-y-8 text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the FitIQ web application, you agree to be bound by these Terms of Service. If you do not
              agree with any part of these terms, you must discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              2. User Accounts and Guest Access
            </h2>
            <p>
              FitIQ allows users to explore features in guest trial mode without an upfront account. To persist wardrobe collections
              across sessions and unlock unlimited uploads, you may authenticate via email or third-party OAuth providers. You
              are responsible for maintaining the confidentiality of your session credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              3. Intellectual Property and Content Ownership
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-400">
              <li>
                <strong>Your Content:</strong> You retain full copyright and ownership of all clothing photos, garment descriptions,
                and wardrobe records uploaded to your account.
              </li>
              <li>
                <strong>License to FitIQ:</strong> You grant FitIQ a limited, non-exclusive license to store, process, compress, and
                render your wardrobe media solely to provide wardrobe management and outfit pairing functionality to you.
              </li>
              <li>
                <strong>FitIQ Platform:</strong> The visual branding, interface design, algorithms, stylesheets, and curated presets
                are the intellectual property of FitIQ.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              4. Acceptable Use Policy
            </h2>
            <p>
              You agree not to upload content that is unlawful, infringing on third-party trademarks without authorization, or
              containing malicious software. FitIQ reserves the right to remove any media that violates these standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              5. Disclaimer of Warranties and Limitation of Liability
            </h2>
            <p>
              The FitIQ application and styling recommendations are provided on an &quot;as is&quot; and &quot;as available&quot; basis. While our
              algorithms suggest occasion pairings and luggage capsule allocations with care, styling outputs reflect subjective
              aesthetic direction rather than commercial guarantees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              6. Inquiries and Legal Notice
            </h2>
            <div className="rounded-xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 p-4">
              <p className="font-medium text-[#1C1917] dark:text-[#F5F2EC]">FitIQ Legal Operations</p>
              <p className="text-stone-500 mt-1">
                Email:{" "}
                <a href="mailto:support@fitiq.com" className="text-[#E0623A] underline hover:text-[#C8532F]">
                  support@fitiq.com
                </a>
              </p>
              <p className="text-stone-500 mt-1">
                Phone:{" "}
                <a href="tel:+18005550199" className="text-stone-700 dark:text-stone-300 hover:text-[#E0623A]">
                  +1 (800) 555-0199
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 pt-6 border-t border-[#EAE6DF] dark:border-[#2E2A26] flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-4 py-2 text-xs font-medium transition-all shadow-sm"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Application</span>
          </Link>
          <Link
            href="/privacy"
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            View Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
}

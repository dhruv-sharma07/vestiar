import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Privacy Policy: FitIQ",
  description: "FitIQ privacy standards, data handling procedures, and personal image protection policies.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F2EC]">
      {/* Editorial Navigation */}
      <nav className="sticky top-0 z-30 border-b border-[#EAE6DF] dark:border-[#2E2A26] bg-[#FBF9F5]/90 dark:bg-[#141210]/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-[#1C1917] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Closet</span>
          </Link>

          <Link href="/" className="font-serif text-lg font-medium tracking-tight">
            FitIQ
          </Link>
        </div>
      </nav>

      {/* Main Document Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="border-b border-[#EAE6DF] dark:border-[#2E2A26] pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E8EEE7] dark:bg-[#1E2E22] text-[#2D4A34] dark:text-[#D3E0D5]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Effective Date: November 22, 2026. Last updated: November 2026.
          </p>
        </div>

        <div className="space-y-8 text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              1. Overview and Core Commitment
            </h2>
            <p>
              FitIQ respects your personal space and privacy. This policy outlines how we collect, store, and process
              information when you use our wardrobe curation and occasion pairing services. We do not sell your personal data
              or clothing images to data brokers, advertising networks, or third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-400">
              <li>
                <strong>Account Credentials:</strong> When you authenticate via Google or email magic links, we receive your
                name, verified email address, and profile image.
              </li>
              <li>
                <strong>Wardrobe Media:</strong> Clothing photos, silhouettes, and fabric references you upload to catalog your
                closet.
              </li>
              <li>
                <strong>Styling Metadata:</strong> Item labels, brand notes, estimated values, color hex codes, occasion tags, and
                lookbook pairing history.
              </li>
              <li>
                <strong>Technical Diagnostics:</strong> Browser type, viewport dimensions, operating system, and error logs required
                for system stability.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              3. Image Storage and Content Delivery
            </h2>
            <p>
              Photographs uploaded to FitIQ are processed through high-security encrypted pipelines and stored on secure cloud
              content delivery networks (Cloudinary CDN). Images are stored exclusively for visual rendering within your private
              wardrobe interface and are accessible only through authenticated user sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              4. Visual Recognition and Multimodal Processing
            </h2>
            <p>
              When you upload a garment, automated visual algorithms extract structural piece attributes such as category,
              approximate color palette, and occasion compatibility. These analytical models process image tokens strictly for
              categorization and outfit generation. Your photos are not used to train public generative foundational models.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              5. Data Retention and Erasure Rights
            </h2>
            <p>
              You maintain complete ownership of your wardrobe data. When you delete a clothing item or delete your account, all
              associated database records, relational junction tables, and remote CDN image assets are permanently purged within
              30 days. You may request a complete export of your wardrobe data at any time by contacting our privacy officer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC]">
              6. Contact Our Data Protection Team
            </h2>
            <p>
              For privacy inquiries, data deletion requests, or compliance questions under GDPR or CCPA:
            </p>
            <div className="rounded-xl border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 p-4">
              <p className="font-medium text-[#1C1917] dark:text-[#F5F2EC]">FitIQ Privacy and Data Trust</p>
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
            href="/terms"
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            View Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}

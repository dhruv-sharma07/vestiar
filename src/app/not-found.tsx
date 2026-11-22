import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { VestiarMonogram } from "@/components/vestiar-monogram";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F2EC] flex flex-col justify-between p-6 sm:p-12">
      {/* Top Header */}
      <header className="mx-auto w-full max-w-5xl flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <VestiarMonogram size={28} />
          <span className="font-serif text-lg tracking-[0.18em] uppercase font-light">Vestiar</span>
        </Link>

        <a
          href="mailto:concierge@vestiar.com"
          className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          concierge@vestiar.com
        </a>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-md text-center py-16 sm:py-24">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#FDF8ED] dark:bg-[#251E12] text-[#7B6127] dark:text-[#E5C378] border border-[#E8D9B9] dark:border-[#4A3D22] mb-6">
          <Compass className="h-6 w-6 stroke-[1.5]" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2 font-mono">
          404: Silhouette Not In Atelier
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1C1917] dark:text-[#F5F2EC] mb-4">
          This piece is not in your closet.
        </h1>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
          The link you followed may have expired, or the garment route has been retired from the collection archive.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#E0623A] hover:bg-[#C8532F] text-white px-5 py-2.5 text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Atelier</span>
          </Link>

          <a
            href="mailto:concierge@vestiar.com"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-[#EAE6DF] dark:border-[#2E2A26] bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 px-5 py-2.5 text-xs font-medium transition-all"
          >
            Contact Atelier Concierge
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-stone-400 dark:text-stone-600 pt-8 border-t border-[#EAE6DF] dark:border-[#2E2A26] font-serif">
        VESTIAR &bull; Atelier de Garde-Robe Privée
      </footer>
    </div>
  );
}

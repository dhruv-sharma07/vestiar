import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export const metadata: Metadata = {
  title: "VESTIAR: Private Wardrobe Atelier & Occasion Dressing",
  description:
    "An intimate digital salon for personal wardrobe curation, tonal silhouette harmony, and bespoke occasion dressing.",
  keywords: [
    "vestiar",
    "wardrobe atelier",
    "capsule wardrobe",
    "outfit planner",
    "occasion pairing",
    "minimalist fashion",
    "closet organization",
  ],
  authors: [{ name: "VESTIAR Atelier Privé" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "VESTIAR: Private Wardrobe Atelier & Occasion Dressing",
    description:
      "An intimate digital salon for personal wardrobe curation, tonal silhouette harmony, and bespoke occasion dressing.",
    url: "https://vestiar.com",
    siteName: "VESTIAR",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VESTIAR: Private Wardrobe Atelier & Occasion Dressing",
    description:
      "An intimate digital salon for personal wardrobe curation, tonal silhouette harmony, and bespoke occasion dressing.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip scroll-smooth">
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased selection:bg-[#E0623A]/15 selection:text-[#E0623A] font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

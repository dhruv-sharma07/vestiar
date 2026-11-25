import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E5E8CE",
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
    <html lang="en" suppressHydrationWarning className="overflow-x-clip scroll-smooth light">
      <body className="min-h-screen overflow-x-clip bg-background text-foreground antialiased selection:bg-[#789575]/25 selection:text-[#202D1F] font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

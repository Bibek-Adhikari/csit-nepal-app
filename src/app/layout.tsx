import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { SentryProvider } from "@/components/sentry-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "") : undefined;
const APP_URL = SITE_URL
  || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  || "https://bcanepal.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "BCA Nepal - TU BCA Study Hub",
    template: "%s | BCA Nepal",
  },
  description: "Mobile-first study hub for Tribhuvan University BCA students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track your study progress — all offline.",
  keywords: ["BCA Nepal", "TU BCA", "Tribhuvan University", "BCA notes", "BCA study", "semester notes", "BCA PDF", "BCA lectures", "Nepal BCA"],
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "BCA Nepal - TU BCA Study Hub",
    description: "Access semester notes, PDFs, handwritten notes, and YouTube lectures for Tribhuvan University BCA students. Works offline.",
    url: APP_URL,
    siteName: "BCA Nepal",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icons/fabi.jpg",
        width: 1264,
        height: 848,
        alt: "BCA Nepal - TU BCA Study Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCA Nepal - TU BCA Study Hub",
    description: "Access semester notes, PDFs, handwritten notes, and YouTube lectures for TU BCA students.",
    images: ["/icons/fabi.jpg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "BCA Nepal",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "theme-color": "#2563eb",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} antialiased`}>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="BCA Nepal" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SentryProvider>
            <div className="app-shell">
              <AppHeader />
              <main className="app-viewport">{children}</main>
              <SiteNav />
              <ServiceWorkerRegister />
            </div>
          </SentryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

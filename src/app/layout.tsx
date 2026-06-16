import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "BCA Nepal",
  description: "Mobile-first TU BCA study hub with semesters, lectures, notes, and progress tracking.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "BCA Nepal",
    description: "TU BCA study hub — semesters, lectures, notes, and progress tracking for Tribhuvan University students.",
    url: APP_URL,
    siteName: "BCA Nepal",
    type: "website",
    images: [{ url: "/icons/fabi.jpg", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "BCA Nepal",
    description: "TU BCA study hub with notes, lectures, and progress tracking.",
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
          <div className="app-shell">
            <AppHeader />
            <main className="app-viewport">{children}</main>
            <SiteNav />
            <ServiceWorkerRegister />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

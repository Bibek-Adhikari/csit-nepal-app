import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { OfflineBanner } from "@/components/offline-banner";
import { RouteProgress } from "@/components/route-progress";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/json-ld";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http") ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "") : undefined;
const APP_URL = SITE_URL || "https://csitnepal.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "CSIT Nepal - TU BSc CSIT Study Hub",
    template: "%s | CSIT Nepal",
  },
  description: "Mobile-first study hub for Tribhuvan University BSc CSIT students. Access semester notes, PDFs, handwritten notes, YouTube lectures, and track your study progress — all offline.",
  keywords: ["CSIT Nepal", "TU CSIT", "BSc CSIT", "Tribhuvan University", "CSIT notes", "CSIT study", "semester notes", "CSIT PDF", "CSIT lectures", "Nepal CSIT"],
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "CSIT Nepal - TU BSc CSIT Study Hub",
    description: "Access semester notes, PDFs, handwritten notes, and YouTube lectures for Tribhuvan University BSc CSIT students. Works offline.",
    url: APP_URL,
    siteName: "CSIT Nepal",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/icons/fabi.jpg",
        width: 1264,
        height: 848,
        alt: "CSIT Nepal - TU BSc CSIT Study Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSIT Nepal - TU BSc CSIT Study Hub",
    description: "Access semester notes, PDFs, handwritten notes, and YouTube lectures for TU CSIT students.",
    images: ["/icons/fabi.jpg"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "CSIT Nepal",
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5307415243144212"
     crossOrigin="anonymous"></script>
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="CSIT Nepal" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TDJL2X9D');`}
        </Script>
        <Script id="ga4" strategy="beforeInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-3MLZFJ1XP5" />
        <Script id="ga4-init" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-3MLZFJ1XP5');`}
        </Script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js" strategy="afterInteractive" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="app-shell">
            <RouteProgress />
            <AppHeader />
            <OfflineBanner />
            <main className="app-viewport">{children}</main>
            <SiteNav />
            <ServiceWorkerRegister />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

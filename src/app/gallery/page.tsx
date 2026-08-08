import type { Metadata } from "next";
import { Suspense } from "react";
import { BackNav } from "@/components/back-nav";
import ImageGallery from "@/components/image-gallery";

export const metadata: Metadata = {
  title: "BCA Nepal Gallery | Save & Organize Study Notes by Subject",
  description:
    "Save images from your phone gallery directly to BCA Nepal. Organize study notes, screenshots, and diagrams by semester and subject. View in fullscreen with swipe navigation — all stored privately on your device, works offline.",
  keywords: [
    "BCA Nepal gallery",
    "save study notes",
    "BCA semester notes",
    "organize images by subject",
    "offline study app",
    "BCA Tribhuvan University",
    "study screenshot organizer",
    "PWA gallery",
  ],
  openGraph: {
    title: "BCA Nepal Gallery | Save & Organize Study Notes",
    description:
      "Save images from your gallery app directly to BCA Nepal. Organize by subject. View fullscreen. Works offline.",
    type: "website",
    images: ["/icons/icon-512x512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCA Nepal Gallery",
    description: "Save and organize study images by BCA semester and subject.",
  },
  alternates: {
    canonical: "/gallery",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BCA Nepal Gallery",
  description:
    "Save and organize study images by BCA semester and subject. Share directly from your phone's gallery app.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Android",
  offers: { "@type": "Offer", price: "0" },
  featureList: [
    "Save images from native gallery via Share Target API",
    "Organize by BCA semester and subject",
    "Fullscreen viewer with swipe navigation",
    "Works offline with IndexedDB storage",
    "No account required — data stays on device",
  ],
};

function GalleryContent() {
  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <h1>BCA Nepal Gallery</h1>
        <p>Save images from your phone gallery directly to BCA Nepal. Organize study notes, screenshots, and diagrams by semester and subject. View in fullscreen with swipe navigation — all stored privately on your device, works offline.</p>
      </section>
      <div style={{ padding: "0 1rem 1.5rem" }}>
        <ImageGallery />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <section className="welcome-hero">
          <h1>BCA Nepal Gallery</h1>
          <p>Loading...</p>
        </section>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}

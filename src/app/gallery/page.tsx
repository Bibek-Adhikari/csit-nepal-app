"use client";

import { Suspense } from "react";
import { BackNav } from "@/components/back-nav";
import ImageGallery from "@/components/image-gallery";

function GalleryContent() {
  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <h1>BCA Gallery</h1>
        <p>Your saved study notes and screenshots. Share images from your gallery app to add more.</p>
      </section>
      <div style={{ padding: "0 1rem 1.5rem" }}>
        <ImageGallery />
      </div>
    </>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <section className="welcome-hero">
        <h1>BCA Gallery</h1>
        <p>Loading...</p>
      </section>
    }>
      <GalleryContent />
    </Suspense>
  );
}

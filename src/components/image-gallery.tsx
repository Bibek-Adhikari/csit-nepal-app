"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { getSharedImages, deleteSharedImage } from "@/lib/db";
import type { SharedImage } from "@/lib/db";
import { semesters } from "@/content/subjects";

interface ImageGalleryProps {
  onCountChange?: (count: number) => void;
}

function GallerySwiper({ images, activeIndex, blobUrls, onClose, onIndexChange, onDelete }: {
  images: SharedImage[];
  activeIndex: number;
  blobUrls: Record<string, string>;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  onDelete: (id: string) => void;
}) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const lockY = useRef(false);

  const goTo = (index: number) => {
    if (index < 0 || index >= images.length) return;
    setTransitioning(true);
    onIndexChange(index);
    setTimeout(() => {
      setOffset(0);
      setTransitioning(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (transitioning) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    lockY.current = false;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || transitioning) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (!lockY.current && Math.abs(dy) > Math.abs(dx) * 0.8) {
      lockY.current = true;
      setDragging(false);
      return;
    }
    lockY.current = true;

    const w = typeof window !== "undefined" ? window.innerWidth : 375;
    let limited = dx;
    if (activeIndex === 0 && dx > 0) limited = dx * 0.25;
    if (activeIndex === images.length - 1 && dx < 0) limited = dx * 0.25;
    setOffset(limited);
  };

  const handleTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);
    const w = typeof window !== "undefined" ? window.innerWidth : 375;
    const threshold = w * 0.25;

    if (offset < -threshold) goTo(activeIndex + 1);
    else if (offset > threshold) goTo(activeIndex - 1);
    else {
      setTransitioning(true);
      setOffset(0);
      setTimeout(() => setTransitioning(false), 300);
    }
  };

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gallery-top-bar">
        <button className="gallery-icon-btn" onClick={onClose}><i className="bx bx-arrow-back"></i></button>
        <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
        <button className="gallery-icon-btn" onClick={() => onDelete(images[activeIndex].id)}><i className="bx bx-trash"></i></button>
      </div>
      <div
        className="gallery-swipe-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="gallery-image-wrap"
          style={{
            transform: `translateX(${offset}px)`,
            transition: dragging ? "none" : "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blobUrls[images[activeIndex].id] || ""} alt={images[activeIndex].name} className="gallery-full-img" draggable={false} />
        </div>
      </div>
      <div className="gallery-bottom-bar"><span className="gallery-filename">{images[activeIndex].name}</span></div>
    </div>
  );
}

export default function ImageGallery({ onCountChange }: ImageGalleryProps) {
  const [images, setImages] = useState<SharedImage[]>([]);
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async () => {
    const imgs = await getSharedImages();
    imgs.sort((a, b) => b.savedAt - a.savedAt);
    setImages(imgs);
    onCountChange?.(imgs.length);
  }, [onCountChange]);

  useEffect(() => { loadImages(); }, [loadImages]);

  useEffect(() => {
    document.body.classList.toggle("gallery-fullscreen", fullscreen);
    return () => document.body.classList.remove("gallery-fullscreen");
  }, [fullscreen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!fullscreen) return;
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  const filtered = useMemo(
    () => (selectedSubjects.length > 0 ? images.filter((img) => selectedSubjects.includes(img.subject)) : images),
    [images, selectedSubjects]
  );

  useEffect(() => {
    const urls: Record<string, string> = {};
    for (const img of images) {
      urls[img.id] = URL.createObjectURL(img.blob);
    }
    setBlobUrls(urls);
    return () => {
      for (const url of Object.values(urls)) {
        URL.revokeObjectURL(url);
      }
    };
  }, [images]);

  const handleDelete = useCallback(async (id: string) => {
    await deleteSharedImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    setBlobUrls((prev) => {
      if (prev[id]) URL.revokeObjectURL(prev[id]);
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (fullscreen) {
      const remaining = images.filter((img) => img.id !== id);
      if (remaining.length === 0) {
        setFullscreen(false);
      } else if (activeIndex >= remaining.length) {
        setActiveIndex(remaining.length - 1);
      }
    }
  }, [fullscreen, images, activeIndex]);

  const open = (index: number) => { setActiveIndex(index); setFullscreen(true); };
  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));

  const toggleSubject = (slug: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const label = (slug: string) => {
    for (const sem of semesters) {
      const sub = sem.subjects.find((s) => s.slug === slug);
      if (sub) return sub.title;
    }
    return slug;
  };

  if (images.length === 0) {
    return (
      <div className="pwa-steps" style={{ marginTop: "0.5rem" }}>
        <div className="pwa-step">
          <span className="pwa-step-num">1</span>
          <div className="pwa-step-content">
            <h4>Open Gallery</h4>
            <p>Select images in your phone&apos;s gallery app</p>
          </div>
        </div>
        <div className="pwa-step">
          <span className="pwa-step-num">2</span>
          <div className="pwa-step-content">
            <h4>Tap Share</h4>
            <p>Choose <strong>BCA Nepal</strong></p>
          </div>
        </div>
        <div className="pwa-step">
          <span className="pwa-step-num">3</span>
          <div className="pwa-step-content">
            <h4>Select Subject</h4>
            <p>Pick subject, tap <strong>Save</strong></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "0.5rem" }}>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="gallery-filter-btn">
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <i className="bx bx-filter-alt" style={{ color: "var(--primary)", fontSize: 15 }}></i>
              {selectedSubjects.length === 0 ? "Filter by subject" : `${selectedSubjects.length} selected`}
            </span>
            <i className={`bx bx-chevron-${dropdownOpen ? "up" : "down"}`} style={{ fontSize: 14 }}></i>
          </button>

          {dropdownOpen && (
            <div className="gallery-dropdown">
              {semesters.map((sem) => (
                <div key={sem.key}>
                  <div className="gallery-dropdown-head">{sem.label}</div>
                  {sem.subjects.map((sub) => (
                    <label key={sub.slug} className={`gallery-dropdown-item${selectedSubjects.includes(sub.slug) ? " active" : ""}`}>
                      <input type="checkbox" checked={selectedSubjects.includes(sub.slug)} onChange={() => toggleSubject(sub.slug)} />
                      <span>{sub.title}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSubjects.length > 0 && (
          <div className="gallery-chips">
            {selectedSubjects.map((slug) => (
              <span key={slug} className="gallery-chip" onClick={() => toggleSubject(slug)}>
                {label(slug).split(" ").slice(0, 2).join(" ")}
                <i className="bx bx-x"></i>
              </span>
            ))}
            <span className="gallery-chip-clear" onClick={() => setSelectedSubjects([])}>Clear</span>
          </div>
        )}
      </div>

      <div className="gallery-grid">
        {filtered.map((img, i) => (
          <div key={img.id} onClick={() => open(i)} className="gallery-item">
            {blobUrls[img.id] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blobUrls[img.id]} alt={img.name} loading="lazy" decoding="async" className="gallery-thumb" />
                <button className="gallery-del" onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }} aria-label="Delete">
                  <i className="bx bx-x"></i>
                </button>
              </>
            ) : (
              <div className="gallery-placeholder"><i className="bx bx-image"></i></div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && selectedSubjects.length > 0 && (
        <div className="empty-state" style={{ padding: "1.5rem 1rem" }}>
          <i className="bx bx-image" style={{ fontSize: "2rem", color: "var(--text-muted)" }}></i>
          <p>No images for selected subject{selectedSubjects.length > 1 ? "s" : ""}.</p>
        </div>
      )}

      {fullscreen && filtered.length > 0 && activeIndex < filtered.length &&
        createPortal(
          <GallerySwiper
            images={filtered}
            activeIndex={activeIndex}
            blobUrls={blobUrls}
            onClose={() => { setFullscreen(false); if (window.location.hash === "#gallery") window.history.back(); }}
            onIndexChange={setActiveIndex}
            onDelete={handleDelete}
          />,
          document.body
        )}
    </>
  );
}

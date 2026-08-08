"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { getSharedImages, deleteSharedImage } from "@/lib/db";
import type { SharedImage } from "@/lib/db";
import { semesters } from "@/content/subjects";

interface ImageGalleryProps {
  onCountChange?: (count: number) => void;
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
  }, []);

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

      {fullscreen && filtered.length > 0 &&
        createPortal(
          <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}>
            <div className="gallery-top-bar">
              <button className="gallery-icon-btn" onClick={() => setFullscreen(false)}><i className="bx bx-arrow-back"></i></button>
              <span className="gallery-counter">{activeIndex + 1} / {filtered.length}</span>
              <button className="gallery-icon-btn" onClick={() => handleDelete(filtered[activeIndex].id)}><i className="bx bx-trash"></i></button>
            </div>
            <div
              className="gallery-swipe-area"
              onTouchStart={(e) => { (e.currentTarget as any)._sx = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const sx = (e.currentTarget as any)._sx;
                if (!sx) return;
                const diff = e.changedTouches[0].clientX - sx;
                if (Math.abs(diff) > 50) { diff < 0 ? next() : prev(); }
                (e.currentTarget as any)._sx = null;
              }}
            >
              <button className="gallery-nav gallery-nav-prev" onClick={prev} disabled={activeIndex === 0}>
                <i className="bx bx-chevron-left"></i>
              </button>
              <div className="gallery-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blobUrls[filtered[activeIndex].id] || ""} alt={filtered[activeIndex].name} className="gallery-full-img" draggable={false} />
              </div>
              <button className="gallery-nav gallery-nav-next" onClick={next} disabled={activeIndex === filtered.length - 1}>
                <i className="bx bx-chevron-right"></i>
              </button>
            </div>
            <div className="gallery-bottom-bar"><span className="gallery-filename">{filtered[activeIndex].name}</span></div>
          </div>,
          document.body
        )}
    </>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { getSharedImages, deleteSharedImage } from "@/lib/db";
import type { SharedImage } from "@/lib/db";
import { semesters } from "@/content/subjects";

interface ImageGalleryProps {
  onCountChange?: (count: number) => void;
}

export default function ImageGallery({ onCountChange }: ImageGalleryProps) {
  const [images, setImages] = useState<SharedImage[]>([]);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [fullscreen, setFullscreen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadedThumbs, setLoadedThumbs] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async () => {
    const imgs = await getSharedImages();
    imgs.sort((a, b) => b.savedAt - a.savedAt);
    setImages(imgs);
    onCountChange?.(imgs.length);
  }, [onCountChange]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (fullscreen) {
      document.body.classList.add("gallery-fullscreen");
    } else {
      document.body.classList.remove("gallery-fullscreen");
    }
    return () => document.body.classList.remove("gallery-fullscreen");
  }, [fullscreen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredImages = useMemo(
    () => (selectedSubjects.length > 0 ? images.filter((img) => selectedSubjects.includes(img.subject)) : images),
    [images, selectedSubjects]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!fullscreen) return;
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(filteredImages.length - 1, i + 1));
      if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen, filteredImages.length]);

  const createThumbnail = useCallback((img: SharedImage) => {
    if (thumbnails[img.id] || loadedThumbs.has(img.id)) return;
    setLoadedThumbs((prev) => new Set(prev).add(img.id));

    if (img.blob.type === "image/svg+xml") {
      const url = URL.createObjectURL(img.blob);
      setThumbnails((prev) => ({ ...prev, [img.id]: url }));
      return;
    }

    const url = URL.createObjectURL(img.blob);
    const imgEl = new Image();
    imgEl.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 200;
      let w = imgEl.naturalWidth;
      let h = imgEl.naturalHeight;
      if (w > maxSize || h > maxSize) {
        if (w > h) {
          h = Math.round((h * maxSize) / w);
          w = maxSize;
        } else {
          w = Math.round((w * maxSize) / h);
          h = maxSize;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(imgEl, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const thumbUrl = URL.createObjectURL(blob);
            setThumbnails((prev) => ({ ...prev, [img.id]: thumbUrl }));
          }
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.65
      );
    };
    imgEl.onerror = () => {
      URL.revokeObjectURL(url);
    };
    imgEl.src = url;
  }, [thumbnails, loadedThumbs]);

  useEffect(() => {
    for (const img of images) {
      createThumbnail(img);
    }
  }, [images, createThumbnail]);

  useEffect(() => {
    return () => {
      for (const url of Object.values(thumbnails)) {
        URL.revokeObjectURL(url);
      }
    };
  }, [thumbnails]);

  const handleDelete = async (id: string) => {
    await deleteSharedImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
    setThumbnails((prev) => {
      const next = { ...prev };
      if (next[id]) URL.revokeObjectURL(next[id]);
      delete next[id];
      return next;
    });
  };

  const openFullscreen = (index: number) => {
    setActiveIndex(index);
    setFullscreen(true);
  };

  const goPrev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const goNext = () => setActiveIndex((i) => Math.min(filteredImages.length - 1, i + 1));

  const toggleSubject = (slug: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const getSubjectLabel = (slug: string) => {
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
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: dropdownOpen ? "var(--bg-muted)" : "var(--bg-app)",
              color: "var(--text)",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <i className="bx bx-filter-alt" style={{ color: "var(--primary)", fontSize: 15 }}></i>
              {selectedSubjects.length === 0
                ? "Filter by subject"
                : `${selectedSubjects.length} selected`}
            </span>
            <i className={`bx bx-chevron-${dropdownOpen ? "up" : "down"}`} style={{ fontSize: 14 }}></i>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--bg-app)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                zIndex: 50,
                maxHeight: 300,
                overflowY: "auto",
              }}
            >
              {semesters.map((sem) => (
                <div key={sem.key}>
                  <div
                    style={{
                      padding: "0.5rem 0.75rem 0.3rem",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--text-muted)",
                      background: "var(--bg-muted)",
                      position: "sticky",
                      top: 0,
                    }}
                  >
                    {sem.label}
                  </div>
                  {sem.subjects.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub.slug);
                    return (
                      <label
                        key={sub.slug}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.55rem",
                          padding: "0.5rem 0.75rem",
                          cursor: "pointer",
                          background: isSelected ? "var(--bg-muted)" : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSubject(sub.slug)}
                          style={{ width: 15, height: 15, accentColor: "#2563eb" }}
                        />
                        <span style={{ fontSize: "0.78rem" }}>{sub.title}</span>
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSubjects.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.4rem" }}>
            {selectedSubjects.map((slug) => (
              <span
                key={slug}
                onClick={() => toggleSubject(slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.25rem 0.5rem",
                  borderRadius: 999,
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {getSubjectLabel(slug).split(" ").slice(0, 2).join(" ")}
                <i className="bx bx-x" style={{ fontSize: 11 }}></i>
              </span>
            ))}
            <span
              onClick={() => setSelectedSubjects([])}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.25rem 0.5rem",
                borderRadius: 999,
                background: "var(--bg-muted)",
                color: "var(--text-muted)",
                fontSize: "0.68rem",
                cursor: "pointer",
              }}
            >
              Clear
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: 2,
        }}
      >
        {filteredImages.map((img, index) => (
          <div
            key={img.id}
            onClick={() => openFullscreen(index)}
            style={{
              position: "relative",
              aspectRatio: "1",
              background: "var(--bg-muted)",
              cursor: "pointer",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {thumbnails[img.id] ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnails[img.id]}
                  alt={img.name}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  role="button"
                  aria-label="Delete"
                >
                  <i className="bx bx-x" style={{ color: "#fff", fontSize: 10 }}></i>
                </span>
              </>
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="bx bx-image" style={{ color: "var(--text-muted)", fontSize: 18 }}></i>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && selectedSubjects.length > 0 && (
        <div className="empty-state" style={{ padding: "1.5rem 1rem" }}>
          <i className="bx bx-image" style={{ fontSize: "2rem", color: "var(--text-muted)" }}></i>
          <p>No images for selected subject{selectedSubjects.length > 1 ? "s" : ""}.</p>
        </div>
      )}

      {fullscreen && filteredImages.length > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.75rem",
              background: "rgba(0,0,0,0.8)",
              minHeight: 48,
            }}
          >
            <button
              onClick={() => setFullscreen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 24,
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
              }}
            >
              <i className="bx bx-arrow-back"></i>
            </button>
            <span style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 500 }}>
              {activeIndex + 1} / {filteredImages.length}
            </span>
            <span
              onClick={() => handleDelete(filteredImages[activeIndex].id)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                padding: "0.25rem 0.5rem",
              }}
            >
              <i className="bx bx-trash"></i>
            </span>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
            <button
              onClick={goPrev}
              disabled={activeIndex === 0}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 48,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: activeIndex === 0 ? "rgba(255,255,255,0.2)" : "#fff",
                fontSize: 28,
                cursor: activeIndex === 0 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <i className="bx bx-chevron-left"></i>
            </button>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: "0 48px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnails[filteredImages[activeIndex].id] || ""}
                alt={filteredImages[activeIndex].name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  transition: "opacity 0.2s ease",
                }}
                draggable={false}
              />
            </div>

            <button
              onClick={goNext}
              disabled={activeIndex === filteredImages.length - 1}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 48,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: activeIndex === filteredImages.length - 1 ? "rgba(255,255,255,0.2)" : "#fff",
                fontSize: 28,
                cursor: activeIndex === filteredImages.length - 1 ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <i className="bx bx-chevron-right"></i>
            </button>
          </div>

          <div
            style={{
              padding: "0.5rem 0.75rem",
              background: "rgba(0,0,0,0.8)",
              textAlign: "center",
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>
              {filteredImages[activeIndex].name}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

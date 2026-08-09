"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { getSharedImages, deleteSharedImage, saveSharedImages } from "@/lib/db";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [savedRotation, setSavedRotation] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const dragging = useRef(false);
  const pinchDist = useRef(0);
  const panStart = useRef({ x: 0, y: 0 });

  const rotateCW = () => setRotation((r) => (r + 90) % 360);
  const rotateCCW = () => setRotation((r) => (r - 90 + 360) % 360);
  const undoRotation = () => setRotation(savedRotation);

  const saveRotation = async () => {
    setSaving(true);
    const img = images[activeIndex];
    const store = await getSharedImages();
    const existing = store.find((s) => s.id === img.id);
    if (existing) {
      const updated = { ...existing, rotation };
      await saveSharedImages([updated]);
    }
    setSavedRotation(rotation);
    setSaving(false);
    setMenuOpen(false);
  };

  const handleScroll = useCallback(() => {
    if (trackRef.current && zoom === 1) {
      const idx = Math.round(trackRef.current.scrollLeft / window.innerWidth);
      if (idx !== activeIndex && idx >= 0 && idx < images.length) {
        onIndexChange(idx);
      }
    }
  }, [activeIndex, images.length, onIndexChange, zoom]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragging.current = true;
    if (e.touches.length === 2) {
      pinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && zoom > 1) {
      panStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newZoom = Math.min(Math.max(1, (dist / pinchDist.current) * zoom), 4);
      setZoom(newZoom);
      if (newZoom === 1) setPan({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && zoom > 1) {
      e.preventDefault();
      setPan({
        x: e.touches[0].clientX - panStart.current.x,
        y: e.touches[0].clientY - panStart.current.y,
      });
    }
  }, [zoom]);

  const handleTouchEnd = useCallback(() => {
    dragging.current = false;
    if (zoom < 1) setZoom(1);
    if (zoom > 4) setZoom(4);
  }, [zoom]);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  }, [zoom]);

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gallery-top-bar">
        <button className="gallery-icon-btn" onClick={onClose}><i className="bx bx-arrow-back"></i></button>
        <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
        <button className="gallery-icon-btn" onClick={() => setMenuOpen(!menuOpen)}><i className="bx bx-rotate-right"></i></button>
        <button className="gallery-icon-btn" onClick={() => onDelete(images[activeIndex].id)}><i className="bx bx-trash"></i></button>
      </div>

      {menuOpen && (
        <div className="gallery-menu">
          <button className="gallery-menu-btn" onClick={rotateCCW}>
            <i className="bx bx-rotate-left"></i> Rotate Left
          </button>
          <button className="gallery-menu-btn" onClick={rotateCW}>
            <i className="bx bx-rotate-right"></i> Rotate Right
          </button>
          <button className="gallery-menu-btn" onClick={undoRotation} disabled={rotation === savedRotation}>
            <i className="bx bx-undo"></i> Undo
          </button>
          <button className="gallery-menu-btn gallery-menu-save" onClick={saveRotation} disabled={rotation === savedRotation || saving}>
            <i className="bx bx-check"></i> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <div className="gallery-swipe-area" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div
          ref={trackRef}
          className="gallery-track"
          onScroll={handleScroll}
          style={{ scrollSnapType: zoom > 1 ? "none" : "x mandatory" }}
        >
          {images.map((img, i) => (
            <div key={img.id} className="gallery-slide" onDoubleClick={handleDoubleClick}>
              <div
                ref={i === activeIndex ? slideRef : null}
                className="gallery-img-inner"
                style={i === activeIndex ? {
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: (zoom === 1 && !dragging.current) ? "transform 0.3s ease" : "none",
                } : undefined}
              >
                <img src={blobUrls[img.id] || ""} alt={img.name} className="gallery-full-img" draggable={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="gallery-bottom-bar">
        <span className="gallery-filename">{images[activeIndex].name} {rotation !== 0 && `(${rotation}°)`}</span>
      </div>
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

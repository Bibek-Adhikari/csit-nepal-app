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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [savedRotation, setSavedRotation] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const cropStart = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(0);
  const panStart = useRef({ x: 0, y: 0 });

  const handleScroll = useCallback(() => {
    if (trackRef.current && zoom === 1 && !cropping) {
      const idx = Math.round(trackRef.current.scrollLeft / window.innerWidth);
      if (idx !== activeIndex && idx >= 0 && idx < images.length) {
        onIndexChange(idx);
      }
    }
  }, [activeIndex, images.length, onIndexChange, zoom, cropping]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (cropping) return;
    if (e.touches.length === 2) {
      pinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && zoom > 1) {
      panStart.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
    }
  }, [zoom, pan, cropping]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (cropping) return;
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
  }, [zoom, cropping]);

  const handleTouchEnd = useCallback(() => {
    if (zoom < 1) setZoom(1);
    if (zoom > 4) setZoom(4);
  }, [zoom]);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) { setZoom(1); setPan({ x: 0, y: 0 }); }
    else setZoom(2.5);
  }, [zoom]);

  const rotateCW = () => setRotation((r) => (r + 90) % 360);
  const rotateCCW = () => setRotation((r) => (r - 90 + 360) % 360);
  const undoRotation = () => setRotation(savedRotation);

  const saveRotation = async () => {
    setSaving(true);
    const img = images[activeIndex];
    const store = await getSharedImages();
    const existing = store.find((s) => s.id === img.id);
    if (existing) {
      await saveSharedImages([{ ...existing, rotation }]);
    }
    setSavedRotation(rotation);
    setSaving(false);
    setMenuOpen(false);
  };

  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  const startCrop = () => {
    setCropping(true);
    setMenuOpen(false);
    setCropArea({ x: 10, y: 10, w: 80, h: 80 });
  };

  const handleCropTouchStart = (handle: string) => (e: React.TouchEvent) => {
    e.stopPropagation();
    setActiveHandle(handle);
  };

  const handleCropTouchMove = (e: React.TouchEvent) => {
    if (!activeHandle) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setCropArea((prev) => {
      let { x: px, y: py, w, h } = prev;
      const minSize = 10;

      if (activeHandle.includes("right")) w = Math.max(minSize, Math.min(x - px, 100 - px));
      if (activeHandle.includes("bottom")) h = Math.max(minSize, Math.min(y - py, 100 - py));
      if (activeHandle.includes("left")) {
        const newX = Math.max(0, Math.min(x, px + w - minSize));
        w = w + px - newX;
        px = newX;
      }
      if (activeHandle.includes("top")) {
        const newY = Math.max(0, Math.min(y, py + h - minSize));
        h = h + py - newY;
        py = newY;
      }
      if (activeHandle === "move") {
        px = Math.max(0, Math.min(x - w / 2, 100 - w));
        py = Math.max(0, Math.min(y - h / 2, 100 - h));
      }

      return { x: px, y: py, w, h };
    });
  };

  const handleCropTouchEnd = () => {
    setActiveHandle(null);
  };

  const applyCrop = async () => {
    const img = images[activeIndex];
    const blob = img.blob;
    const url = URL.createObjectURL(blob);
    const imageEl = new Image();
    imageEl.onload = () => {
      const canvas = document.createElement("canvas");
      const cx = (cropArea.x / 100) * imageEl.naturalWidth;
      const cy = (cropArea.y / 100) * imageEl.naturalHeight;
      const cw = (cropArea.w / 100) * imageEl.naturalWidth;
      const ch = (cropArea.h / 100) * imageEl.naturalHeight;
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(imageEl, cx, cy, cw, ch, 0, 0, cw, ch);
        canvas.toBlob(async (newBlob) => {
          if (newBlob) {
            const updated = { ...img, blob: newBlob, name: `cropped_${img.name}` };
            await saveSharedImages([updated]);
            setCropping(false);
            setMenuOpen(false);
            window.location.reload();
          }
        }, "image/jpeg", 0.9);
      }
      URL.revokeObjectURL(url);
    };
    imageEl.src = url;
  };

  const isRotated = rotation === 90 || rotation === 270;
  const rotScale = isRotated ? 0.7 : 1;

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gallery-top-bar">
        <button className="gallery-icon-btn" onClick={onClose}><i className="bx bx-arrow-back"></i></button>
        <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
        <button className="gallery-icon-btn" onClick={() => setMenuOpen(!menuOpen)}><i className="bx bx-cog"></i></button>
        <button className="gallery-icon-btn" onClick={() => onDelete(images[activeIndex].id)}><i className="bx bx-trash"></i></button>
      </div>

      {menuOpen && !cropping && (
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
          <button className="gallery-menu-btn" onClick={startCrop}>
            <i className="bx bx-crop"></i> Crop
          </button>
          <button className="gallery-menu-btn gallery-menu-save" onClick={saveRotation} disabled={rotation === savedRotation || saving}>
            <i className="bx bx-check"></i> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <div className="gallery-swipe-area" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {cropping ? (
          <div className="gallery-crop-container">
            <div className="gallery-crop-area" onTouchMove={handleCropTouchMove} onTouchEnd={handleCropTouchEnd}>
              <img src={blobUrls[images[activeIndex].id] || ""} alt="" className="gallery-crop-img" draggable={false} />
              <div className="gallery-crop-overlay" style={{ left: `${cropArea.x}%`, top: `${cropArea.y}%`, width: `${cropArea.w}%`, height: `${cropArea.h}%` }}>
                <div className="gallery-crop-handle gallery-crop-handle-top" onTouchStart={handleCropTouchStart("top")} />
                <div className="gallery-crop-handle gallery-crop-handle-bottom" onTouchStart={handleCropTouchStart("bottom")} />
                <div className="gallery-crop-handle gallery-crop-handle-left" onTouchStart={handleCropTouchStart("left")} />
                <div className="gallery-crop-handle gallery-crop-handle-right" onTouchStart={handleCropTouchStart("right")} />
                <div className="gallery-crop-handle gallery-crop-handle-tl" onTouchStart={handleCropTouchStart("top-left")} />
                <div className="gallery-crop-handle gallery-crop-handle-tr" onTouchStart={handleCropTouchStart("top-right")} />
                <div className="gallery-crop-handle gallery-crop-handle-bl" onTouchStart={handleCropTouchStart("bottom-left")} />
                <div className="gallery-crop-handle gallery-crop-handle-br" onTouchStart={handleCropTouchStart("bottom-right")} />
                <div className="gallery-crop-move" onTouchStart={handleCropTouchStart("move")} />
              </div>
            </div>
            <div className="gallery-crop-actions">
              <button className="gallery-crop-btn" onClick={() => { setCropping(false); setActiveHandle(null); }}>Cancel</button>
              <button className="gallery-crop-btn gallery-crop-apply" onClick={applyCrop}>Apply Crop</button>
            </div>
          </div>
        ) : (
          <div
            ref={trackRef}
            className="gallery-track"
            onScroll={handleScroll}
            style={{ scrollSnapType: zoom > 1 ? "none" : "x mandatory" }}
          >
            {images.map((img, i) => (
              <div key={img.id} className="gallery-slide" onDoubleClick={handleDoubleClick}>
                <div
                  className="gallery-img-inner"
                  style={i === activeIndex ? {
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * rotScale}) rotate(${rotation}deg)`,
                    transition: zoom === 1 ? "transform 0.3s ease" : "none",
                  } : undefined}
                >
                  <img src={blobUrls[img.id] || ""} alt={img.name} className="gallery-full-img" draggable={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="gallery-bottom-bar">
        <span className="gallery-filename">{images[activeIndex].name}{rotation !== 0 && ` (${rotation}°)`}</span>
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
          <div className="pwa-step-content"><h4>Open Gallery</h4><p>Select images in your phone&apos;s gallery app</p></div>
        </div>
        <div className="pwa-step">
          <span className="pwa-step-num">2</span>
          <div className="pwa-step-content"><h4>Tap Share</h4><p>Choose <strong>BCA Nepal</strong></p></div>
        </div>
        <div className="pwa-step">
          <span className="pwa-step-num">3</span>
          <div className="pwa-step-content"><h4>Select Subject</h4><p>Pick subject, tap <strong>Save</strong></p></div>
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
                {label(slug).split(" ").slice(0, 2).join(" ")}<i className="bx bx-x"></i>
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
            onClose={() => setFullscreen(false)}
            onIndexChange={setActiveIndex}
            onDelete={handleDelete}
          />,
          document.body
        )}
    </>
  );
}

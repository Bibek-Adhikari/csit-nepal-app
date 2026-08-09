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
  const [rotation, setRotation] = useState(0);
  const [savedRotation, setSavedRotation] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const cropStart = useRef({ x: 0, y: 0 });
  const pinchDist = useRef(0);
  const panStart = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeIndex !== undefined) {
      zoomRef.current = 1;
      panRef.current = { x: 0, y: 0 };
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [activeIndex]);

  const handleScroll = useCallback(() => {
    if (trackRef.current && zoomRef.current === 1 && !cropping) {
      const idx = Math.round(trackRef.current.scrollLeft / window.innerWidth);
      if (idx !== activeIndex && idx >= 0 && idx < images.length) {
        onIndexChange(idx);
      }
    }
  }, [activeIndex, images.length, onIndexChange, cropping]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (cropping) { e.stopPropagation(); return; }
    if (e.touches.length === 2) {
      pinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && zoomRef.current > 1) {
      panStart.current = { x: e.touches[0].clientX - panRef.current.x, y: e.touches[0].clientY - panRef.current.y };
    }
  }, [cropping]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (cropping) return;
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newZoom = Math.min(Math.max(1, (dist / pinchDist.current) * zoomRef.current), 4);
      zoomRef.current = newZoom;
      setZoom(newZoom);
      if (newZoom === 1) { panRef.current = { x: 0, y: 0 }; setPan({ x: 0, y: 0 }); }
      if (slideRef.current) {
        slideRef.current.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${newZoom}) rotate(${rotation}deg)`;
      }
    } else if (e.touches.length === 1 && zoomRef.current > 1) {
      e.preventDefault();
      const newPan = {
        x: e.touches[0].clientX - panStart.current.x,
        y: e.touches[0].clientY - panStart.current.y,
      };
      panRef.current = newPan;
      setPan(newPan);
      if (slideRef.current) {
        slideRef.current.style.transform = `translate(${newPan.x}px, ${newPan.y}px) scale(${zoomRef.current}) rotate(${rotation}deg)`;
      }
    }
  }, [cropping, rotation]);

  const handleTouchEnd = useCallback(() => {
    if (zoomRef.current < 1) { zoomRef.current = 1; setZoom(1); }
    if (zoomRef.current > 4) { zoomRef.current = 4; setZoom(4); }
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoomRef.current > 1) {
      zoomRef.current = 1;
      panRef.current = { x: 0, y: 0 };
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      zoomRef.current = 2.5;
      setZoom(2.5);
    }
  }, []);

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

  const activeHandle = useRef<string | null>(null);

  const startCrop = () => {
    setCropping(true);
    setMenuOpen(false);
    setCropArea({ x: 10, y: 10, w: 80, h: 80 });
  };

  const handleCropTouchStart = (handle: string) => (e: React.TouchEvent) => {
    e.stopPropagation();
    activeHandle.current = handle;
  };

  const handleCropTouchMove = (e: React.TouchEvent) => {
    if (!activeHandle.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setCropArea((prev) => {
      let { x: px, y: py, w, h } = prev;
      const minSize = 10;
      const handle = activeHandle.current;

      if (handle?.includes("right")) w = Math.max(minSize, Math.min(x - px, 100 - px));
      if (handle?.includes("bottom")) h = Math.max(minSize, Math.min(y - py, 100 - py));
      if (handle?.includes("left")) {
        const newX = Math.max(0, Math.min(x, px + w - minSize));
        w = w + px - newX;
        px = newX;
      }
      if (handle?.includes("top")) {
        const newY = Math.max(0, Math.min(y, py + h - minSize));
        h = h + py - newY;
        py = newY;
      }
      if (handle === "move") {
        px = Math.max(0, Math.min(x - w / 2, 100 - w));
        py = Math.max(0, Math.min(y - h / 2, 100 - h));
      }

      return { x: px, y: py, w, h };
    });
  };

  const handleCropTouchEnd = () => {
    activeHandle.current = null;
  };

  const applyCrop = () => {
    const img = images[activeIndex];
    const url = URL.createObjectURL(img.blob);
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
        const previewUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCropPreview(previewUrl);
        setCropping(false);
        setMenuOpen(true);
      }
      URL.revokeObjectURL(url);
    };
    imageEl.src = url;
  };

  const undoCrop = () => {
    setCropPreview(null);
    setMenuOpen(false);
  };

  const saveCrop = async () => {
    if (!cropPreview) return;
    const img = images[activeIndex];
    const response = await fetch(cropPreview);
    const newBlob = await response.blob();
    const updated = { ...img, blob: newBlob, name: `cropped_${img.name}` };
    await saveSharedImages([updated]);
    setCropPreview(null);
    setMenuOpen(false);
    window.location.reload();
  };

  const isRotated = rotation === 90 || rotation === 270;
  const [rotScale, setRotScale] = useState(1);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = activeIndex * window.innerWidth;
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!isRotated) { setRotScale(1); return; }
    const url = blobUrls[images[activeIndex]?.id];
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.max(vw / img.naturalHeight, vh / img.naturalWidth);
      setRotScale(scale);
    };
    img.src = url;
  }, [isRotated, activeIndex, blobUrls]);

  return (
    <div className="gallery-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="gallery-top-bar">
        <button className="gallery-icon-btn" onClick={onClose}><i className="bx bx-arrow-back"></i></button>
        <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
        <div className="gallery-top-bar-right">
          <button className="gallery-icon-btn" onClick={rotateCW} title="Rotate"><i className="bx bx-rotate-right"></i></button>
          <button className="gallery-icon-btn" onClick={startCrop} title="Crop"><i className="bx bx-crop"></i></button>
          <button className="gallery-icon-btn" onClick={() => onDelete(images[activeIndex].id)} title="Delete"><i className="bx bx-trash"></i></button>
          {cropPreview && (
            <button className="gallery-icon-btn" onClick={() => setMenuOpen(!menuOpen)} title="Options"><i className="bx bx-dots-vertical-rounded"></i></button>
          )}
        </div>
      </div>

      <div className="gallery-swipe-area" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {cropPreview ? (
          <CropCompare
            originalSrc={blobUrls[images[activeIndex].id] || ""}
            croppedSrc={cropPreview}
            onUndo={undoCrop}
            onSave={saveCrop}
          />
        ) : cropping ? (
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
              <button className="gallery-crop-btn" onClick={() => { setCropping(false); activeHandle.current = null; }}>Cancel</button>
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
              <div key={img.id} className={`gallery-slide${isRotated ? " gallery-slide-rotated" : ""}`} onDoubleClick={handleDoubleClick}>
                <div
                  ref={i === activeIndex ? slideRef : undefined}
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

function CropCompare({ originalSrc, croppedSrc, onUndo, onSave }: {
  originalSrc: string;
  croppedSrc: string;
  onUndo: () => void;
  onSave: () => void;
}) {
  const [heights, setHeights] = useState({ orig: 50, cropped: 50 });

  useEffect(() => {
    const origImg = new Image();
    origImg.onload = () => {
      const cropImg = new Image();
      cropImg.onload = () => {
        const origAspect = origImg.naturalWidth / origImg.naturalHeight;
        const cropAspect = cropImg.naturalWidth / cropImg.naturalHeight;
        const vw = window.innerWidth;
        const origHeight = vw / origAspect;
        const cropHeight = vw / cropAspect;
        const total = origHeight + cropHeight;
        setHeights({
          orig: Math.round((origHeight / total) * 100),
          cropped: Math.round((cropHeight / total) * 100),
        });
      };
      cropImg.src = croppedSrc;
    };
    origImg.src = originalSrc;
  }, [originalSrc, croppedSrc]);

  return (
    <div className="gallery-compare">
      <div className="gallery-compare-row">
        <div className="gallery-compare-half" style={{ height: `${heights.orig}%` }}>
          <span className="gallery-compare-label">Original</span>
          <img src={originalSrc} alt="" className="gallery-compare-img" draggable={false} />
        </div>
        <div className="gallery-compare-half" style={{ height: `${heights.cropped}%` }}>
          <span className="gallery-compare-label">Cropped</span>
          <img src={croppedSrc} alt="" className="gallery-compare-img" draggable={false} />
        </div>
      </div>
      <div className="gallery-compare-actions">
        <button className="gallery-compare-btn" onClick={onUndo}>Undo Crop</button>
        <button className="gallery-compare-btn gallery-compare-btn-apply" onClick={onSave}>Save Changes</button>
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

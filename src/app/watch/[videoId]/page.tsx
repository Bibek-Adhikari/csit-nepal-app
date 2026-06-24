"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BackNav } from "@/components/back-nav";
import { VideoNotes } from "@/components/video-notes";
import { lectureVideos } from "@/content/lectures";

export default function WatchPage() {
  const params = useParams();
  const videoId = params.videoId as string;
  const playerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    let player: YT.Player | null = null;

    function initPlayer() {
      if (!playerRef.current || !(window as any).YT?.Player) return;
      player = new YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId,
        playerVars: { rel: 0, modestbranding: 1, origin: window.location.origin },
        events: {
          onReady: () => setReady(true),
          onError: () => setError(true),
        },
      });
    }

    (window as any).onYouTubeIframeAPIReady = initPlayer;

    if (!(window as any).YT?.Player) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    } else {
      initPlayer();
    }

    return () => {
      try { player?.destroy(); } catch {}
    };
  }, [videoId]);

  const video = lectureVideos.find((l) => l.id === videoId);

  return (
    <>
      {video && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: video.title,
              description: `${video.subject} lecture for BCA ${video.semester}.`,
              thumbnailUrl: video.thumbnail,
              embedUrl: `https://www.youtube.com/embed/${video.id}`,
              contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
              duration: video.duration,
            }),
          }}
        />
      )}
      <BackNav href="/lectures" label="Lectures" />
      <div className="watch-container">
        <div className="watch-player-wrapper">
          {error ? (
            <div className="watch-error">
              <i className="bx bxl-youtube" style={{ fontSize: "3rem", color: "#ff0000" }}></i>
              <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>Playback unavailable in-app.</p>
              <Link
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noreferrer noopener"
                className="pill-btn active"
                style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}
              >
                <i className="bx bx-play"></i>
                Watch on YouTube
              </Link>
            </div>
          ) : (
            <div ref={playerRef} style={{ width: "100%", height: "100%" }} />
          )}
          {!ready && !error && (
            <div className="watch-loading">
              <i className="bx bx-loader-alt bx-spin" style={{ fontSize: "2rem", color: "#94a3b8" }}></i>
            </div>
          )}
        </div>
        {video ? <h1 style={{ fontSize: "1rem", fontWeight: 600, margin: "0.75rem 0 0", lineHeight: 1.4 }}>{video.title}</h1> : null}
        <div className="watch-actions">
          <Link
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noreferrer noopener"
            className="pill-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <i className="bx bxl-youtube" style={{ color: "#ff0000" }}></i>
            Open in YouTube
          </Link>
          <Link
            href="/lectures"
            className="pill-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <i className="bx bx-arrow-back"></i>
            Back to Lectures
          </Link>
        </div>
        <VideoNotes videoId={videoId} />
      </div>
    </>
  );
}

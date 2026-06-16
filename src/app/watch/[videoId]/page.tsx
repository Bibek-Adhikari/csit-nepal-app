"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BackNav } from "@/components/back-nav";

export default function WatchPage() {
  const params = useParams();
  const videoId = params.videoId as string;

  return (
    <>
      <BackNav href="/lectures" label="Lectures" />
      <div className="watch-container">
        <div className="watch-player-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="watch-iframe"
            title="YouTube video player"
          />
        </div>
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
      </div>
    </>
  );
}

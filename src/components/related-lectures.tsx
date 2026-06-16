"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type LectureVideo = {
  id: string;
  title: string;
  duration: string;
  meta: string;
  tag: string;
  semester: string;
  subject: string;
  thumbnail: string;
  semesterKey: string;
};

export function RelatedLectures({ semesterKey, subjectSlug }: { semesterKey: string; subjectSlug: string }) {
  const [videos, setVideos] = useState<LectureVideo[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch("/api/lectures", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const allVideos: LectureVideo[] = data.videos ?? [];
        const related = allVideos.filter(
          (v) => v.semesterKey === semesterKey
        );
        setVideos(related.slice(0, 4));
      } catch {
        // silently fail
      }
    }
    fetchRelated();
  }, [semesterKey, subjectSlug]);

  if (videos.length === 0) return null;

  return (
    <section className="unit-notes-section">
      <h3 className="section-headline">Related Lectures</h3>
      <div className="related-lectures-list">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/watch/${video.id}`}
            className="related-lecture-card"
          >
            <div className="related-lecture-thumb">
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                loading="lazy"
              />
              <span className="lecture-duration">{video.duration}</span>
            </div>
            <div className="related-lecture-body">
              <h4 className="related-lecture-title">{video.title}</h4>
              <p className="related-lecture-meta">{video.meta}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

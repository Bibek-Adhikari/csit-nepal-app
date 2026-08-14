import { MetadataRoute } from "next";
import { semesters } from "@/content/subjects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
  : "https://csitnepal.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/subjects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/lectures`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/profile`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const semesterPages = semesters.map((s) => ({
    url: `${SITE_URL}/subjects/${s.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const subjectPages = semesters.flatMap((s) =>
    s.subjects.map((sub) => ({
      url: `${SITE_URL}/subjects/${s.key}/${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  const unitPages = semesters.flatMap((s) =>
    s.subjects.flatMap((sub) =>
      sub.units.map((u) => ({
        url: `${SITE_URL}/notes/${s.key}/${sub.slug}/${u.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    )
  );

  return [...staticPages, ...semesterPages, ...subjectPages, ...unitPages];
}

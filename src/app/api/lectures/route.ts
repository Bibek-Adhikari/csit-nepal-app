import { NextResponse } from "next/server";

const CHANNEL_ID = "UCBvTTBLD1wD1jTQs0OeBZ4Q";
const UPLOADS_PLAYLIST = "UUBvTTBLD1wD1jTQs0OeBZ4Q";
const API_KEY = process.env.YOUTUBE_API_KEY!;

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  meta: string;
  tag: string;
  semester: string;
  subject: string;
  thumbnail: string;
  semesterKey: string;  // Added missing property
}

async function fetchPlaylistItems(pageToken?: string) {
  const params = new URLSearchParams({
    playlistId: UPLOADS_PLAYLIST,
    part: "contentDetails,snippet",
    maxResults: "50",
    key: API_KEY,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return res.json();
}

async function fetchVideoDurations(videoIds: string[]) {
  const ids = videoIds.join(",");
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${ids}&key=${API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return res.json();
}

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatViewCount(views: string): string {
  const n = parseInt(views);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M views`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K views`;
  return `${n} views`;
}

function inferSemester(title: string, fallbackSemester: string): string {
  const semPatterns = [
    { key: "semester-1", patterns: ["1st sem", "1st semester", "semester 1", "bca 1"] },
    { key: "semester-2", patterns: ["2nd sem", "2nd semester", "semester 2", "bca 2"] },
    { key: "semester-3", patterns: ["3rd sem", "3rd semester", "semester 3", "bca 3"] },
    { key: "semester-4", patterns: ["4th sem", "4th semester", "semester 4", "bca 4"] },
  ];
  const lower = title.toLowerCase();
  for (const { key, patterns } of semPatterns) {
    if (patterns.some((p) => lower.includes(p))) return key;
  }
  return fallbackSemester || "semester-2";
}

function inferSubject(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("math") || lower.includes("calculus") || lower.includes("limit") || lower.includes("sequence") || lower.includes("trigonometric") || lower.includes("geometry") || lower.includes("vector")) return "Mathematics";
  if (lower.includes("discrete") || lower.includes("set theory")) return "Discrete Structure";
  if (lower.includes("microprocessor") || lower.includes("microcontroller")) return "Microprocessor";
  if (lower.includes("c programming") || lower.includes("programming in c") || lower.includes("c program")) return "Programming in C";
  if (lower.includes("digital logic") || lower.includes("digital electronics")) return "Digital Logic";
  if (lower.includes("statistics") || lower.includes("probability")) return "Statistics";
  if (lower.includes("oop") || lower.includes("object oriented")) return "OOP";
  if (lower.includes("database") || lower.includes("sql") || lower.includes("dbms")) return "Database";
  if (lower.includes("computer networks") || lower.includes("networking")) return "Computer Networks";
  if (lower.includes("operating system") || lower.includes("os ")) return "Operating System";
  return "General";
}

function inferTag(title: string, position: number): string {
  const lower = title.toLowerCase();
  if (lower.includes("exercise") || lower.includes("solution") || lower.includes("part")) return "Tutorial";
  if (lower.includes("one shot") || lower.includes("complete chapter") || lower.includes("full chapter")) return "Concept";
  if (lower.includes("exam") || lower.includes("question") || lower.includes("important")) return "Exam Prep";
  if (position <= 3) return "New";
  return "Video";
}

export async function GET() {
  try {
    let allItems: any[] = [];
    let pageToken: string | undefined;
    do {
      const data = await fetchPlaylistItems(pageToken);
      allItems.push(...data.items);
      pageToken = data.nextPageToken;
    } while (pageToken);

    const videoIds = allItems
      .map((item) => item.contentDetails.videoId)
      .filter(Boolean);

    const durationMap: Record<string, string> = {};
    const viewMap: Record<string, string> = {};
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const data = await fetchVideoDurations(batch);
      for (const item of data.items) {
        durationMap[item.id] = formatDuration(item.contentDetails.duration);
        viewMap[item.id] = formatViewCount(item.statistics.viewCount);
      }
    }

    const videos: VideoItem[] = allItems.map((item, index) => {
      const id = item.contentDetails.videoId;
      const title = item.snippet.title;
      const semester = inferSemester(title, "semester-2");
      const semLabel = semester.replace("semester-", "Semester ");
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = new Date();
      const diffMs = now.getTime() - publishedAt.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      let timeAgo: string;
      if (diffDays === 0) timeAgo = "today";
      else if (diffDays === 1) timeAgo = "1 day ago";
      else if (diffDays < 30) timeAgo = `${diffDays} days ago`;
      else if (diffDays < 365) timeAgo = `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? "s" : ""} ago`;
      else timeAgo = `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? "s" : ""} ago`;

      return {
        id,
        title,
        duration: durationMap[id] || "0:00",
        meta: `${viewMap[id]} • ${timeAgo}`,
        tag: inferTag(title, index),
        semester: semLabel,
        semesterKey: semester,
        subject: inferSubject(title),
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    });

    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Lectures API error:", error);
    return NextResponse.json({ error: "Failed to fetch lectures" }, { status: 500 });
  }
}
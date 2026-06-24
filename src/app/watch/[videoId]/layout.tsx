import { lectureVideos } from "@/content/lectures";

export async function generateMetadata({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  const video = lectureVideos.find((v) => v.id === videoId);
  if (!video) {
    return { title: "Watch Lecture", alternates: { canonical: `/watch/${videoId}` } };
  }
  return {
    title: video.title.slice(0, 60),
    description: `Watch "${video.title}" — BCA ${video.semester} ${video.subject} lecture.`,
    alternates: { canonical: `/watch/${videoId}` },
  };
}

export default function WatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}

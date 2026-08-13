export type LectureVideo = {
  id: string;
  title: string;
  duration: string;
  meta: string;
  tag: string;
  semester: string;
  subject: string;
  thumbnail: string;
  semesterKey: string;
  storagePath?: string;
  storageBucket?: string;
};

export const lectureVideos: LectureVideo[] = [];
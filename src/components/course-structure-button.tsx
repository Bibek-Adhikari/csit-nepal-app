import type { Unit } from "@/content/subjects/types";

interface CourseStructureButtonProps {
  units: Unit[];
  subjectTitle: string;
  semester: string;
  subject: string;
}

export function CourseStructureButton({ semester, subject }: CourseStructureButtonProps) {
  return (
    <a href={`/subjects/${semester}/${subject}/course-content`} className="csb-minimal-btn">
      Full Course
    </a>
  );
}

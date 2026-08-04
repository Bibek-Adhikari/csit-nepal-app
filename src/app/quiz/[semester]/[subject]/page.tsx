import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSemester, getSubject, type SemesterKey } from "@/content/subjects";
import { SubjectQuiz } from "@/components/subject-quiz";

export async function generateMetadata({ params }: { params: Promise<{ semester: SemesterKey; subject: string }> }): Promise<Metadata> {
  const { semester, subject } = await params;
  const semesterData = getSemester(semester);
  const subjectData = getSubject(semester, subject);
  return {
    title: subjectData ? `${subjectData.title} Quiz - BCA` : "Quiz",
    description: subjectData
      ? `Practice MCQs for ${subjectData.title} (${semesterData?.label || semester}) covering all units. BCA study questions.`
      : "BCA subject quiz.",
  };
}

export default async function SubjectQuizPage({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}) {
  const { semester, subject } = await params;
  const semesterData = getSemester(semester);
  const subjectData = getSubject(semester, subject);

  if (!semesterData || !subjectData) {
    notFound();
  }

  return (
    <SubjectQuiz
      semester={semester}
      subject={subject}
      subjectTitle={subjectData.title}
      units={subjectData.units.map((u) => ({ slug: u.slug, title: u.title }))}
    />
  );
}
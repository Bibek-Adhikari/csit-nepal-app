export type RawQuestion = {
  q: string;
  options: string[];
  a: number;
  topic: string;
  explanation?: string;
};

export type MockQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

let idCounter = 0;

export function toMockQuestion(
  raw: RawQuestion,
  subject: string
): MockQuestion {
  idCounter++;
  return {
    id: "mq-" + subject + "-" + idCounter,
    topic: subject,
    question: raw.q,
    options: raw.options,
    correct_answer: raw.options[raw.a],
    explanation: raw.explanation ?? null,
  };
}

export const englishQuestions: RawQuestion[] = [];

export const mathQuestions: RawQuestion[] = [];

export const gkQuestions: RawQuestion[] = [];

export const rawQuestionBank: Record<string, RawQuestion[]> = {
  english: englishQuestions,
  math: mathQuestions,
  gk: gkQuestions,
  mixed: [...englishQuestions, ...mathQuestions, ...gkQuestions],
};

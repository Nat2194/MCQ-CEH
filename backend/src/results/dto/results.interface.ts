export interface QuizResult {
  title: string;
  score: number;
  total: number;
  answers: Record<string, string[]>;
  date?: string;
}

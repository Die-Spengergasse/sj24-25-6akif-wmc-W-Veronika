export type ExamResult = {
  date: string;
  moduleGuid: string;
  moduleName: string;
  pointsReached: number;
  pointsTotal: number;
};

const STORAGE_KEY = "driving_exam_results";

export function saveExamResult(result: ExamResult) {
  const results = getExamResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function getExamResults(): ExamResult[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as ExamResult[];
  } catch {
    return [];
  }
}

export function clearExamResults() {
  localStorage.removeItem(STORAGE_KEY);
}

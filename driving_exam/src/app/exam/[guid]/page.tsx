/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/app/utils/apiClient";
import { Question, isQuestion } from "@/app/types/Question";
import ExamClient from "./ExamClient";

export default async function ExamPage({ params }: { params: { moduleGuid: string } }) {
  let questions: Question[] = [];
  let error: string | null = null;
  try {
    const response = await axiosInstance.get(`exam/${params.moduleGuid}?count=20`);
    questions = response.data.filter(isQuestion);
  } catch (e: any) {
    error = e?.message ?? "Fehler beim Laden der Prüfungsfragen";
  }

  if (error) {
    return <div className="errorbox">{error}</div>;
  }

  if (questions.length === 0) return <div>Lade Fragen...</div>;

  return <ExamClient questions={questions} moduleGuid={params.moduleGuid} />;
}

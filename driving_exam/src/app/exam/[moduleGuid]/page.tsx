/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";
import { isQuestion } from "@/app/types/Question";
import ExamClient from "./ExamClient";

type Params = {
  moduleGuid: string;
};

export default async function ExamPage({ params }: { params: Params }) {
  const { moduleGuid } = await params;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // Alle Fragen zu einem Modul, über alle Topics
    const res = await axios.get(
      `http://localhost:5080/api/questions/exam/${moduleGuid}?count=20`,
      { httpsAgent: agent }
    );

    const questions = (res.data as any[]).filter(isQuestion);

    if (!questions.length) {
      return <p>Keine Prüfungsfragen für dieses Modul vorhanden.</p>;
    }

    return <ExamClient questions={questions} />;
  } catch (error) {
    console.error("Fehler beim Laden der Prüfungsfragen:", error);
    return <p>Fehler beim Laden der Prüfungsfragen.</p>;
  }
}

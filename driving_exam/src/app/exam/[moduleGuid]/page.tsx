/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";
import { isQuestion } from "@/app/types/Question";
import { isModule, Module } from "@/app/types/Module";
import ExamClient from "./ExamClient";

type Params = {
  moduleGuid: string;
};

export default async function ExamPage({ params }: { params: Params }) {
  const { moduleGuid } = await params;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    // Fragen laden
    const questionRes = await axios.get(
      `http://localhost:5080/api/questions/exam/${moduleGuid}?count=20`,
      { httpsAgent: agent }
    );
    const questions = (questionRes.data as any[]).filter(isQuestion);

    if (!questions.length) {
      return <p>Keine Prüfungsfragen für dieses Modul vorhanden.</p>;
    }

    // Modulnamen zusätzlich laden
    const moduleRes = await axios.get(`http://localhost:5080/api/modules`, {
      httpsAgent: agent,
    });
    const allModules: Module[] = (moduleRes.data as any[]).filter(isModule);

    const currentModule = allModules.find(m => m.guid === moduleGuid);
    const moduleName = currentModule?.name ?? "Unbekanntes Modul";

    return (
      <ExamClient
        questions={questions}
        moduleGuid={moduleGuid}
        moduleName={moduleName}
      />
    );
  } catch (error) {
    console.error("Fehler beim Laden der Prüfungsfragen oder Module:", error);
    return <p>Fehler beim Laden der Prüfungsfragen.</p>;
  }
}

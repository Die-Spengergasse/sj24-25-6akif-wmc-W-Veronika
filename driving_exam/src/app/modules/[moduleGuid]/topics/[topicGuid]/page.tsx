/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";
import { isQuestion } from "@/app/types/Question";
import QuestionsClient from "./QuestionsClient";

type Params = {
  moduleGuid: string;
  topicGuid: string;
};

export async function generateStaticParams() {
  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    // Hole alle Module
    const modulesRes = await axios.get("https://localhost:5443/api/Modules", { httpsAgent: agent });
    const modules = modulesRes.data;

    const params: { moduleGuid: string; topicGuid: string }[] = [];

    for (const mod of modules) {
      // Hole Topics pro Modul
      const topicsRes = await axios.get(
        `https://localhost:5443/api/Topics?assignedModule=${mod.guid}`,
        { httpsAgent: agent }
      );
      const topics = topicsRes.data;

      for (const topic of topics) {
        params.push({ moduleGuid: mod.guid, topicGuid: topic.guid });
      }
    }
    return params;
  } catch {
    return [];
  }
}

export default async function QuestionsPage({ params }: { params: Params }) {
  const { moduleGuid, topicGuid } = params;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const res = await axios.get(
      `https://localhost:5443/api/Questions?moduleGuid=${moduleGuid}&topicGuid=${topicGuid}`,
      { httpsAgent: agent }
    );

    const questions = (res.data as any[]).filter(isQuestion);

    return <QuestionsClient questions={questions} />;
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    return <p>Fehler beim Laden der Fragen.</p>;
  }
}

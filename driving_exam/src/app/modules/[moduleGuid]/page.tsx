import axios from "axios";
import https from "https";
import { isTopic } from "@/app/types/Topic";
import TopicsClient from "./TopicsClient";
import TopicsAdd from "./TopicsAdd";

interface Params {
  moduleGuid: string;
}

export default async function ModuleTopicsPage({ params }: { params: Params }) {
  const { moduleGuid } = await params;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const res = await axios.get(
      `http://localhost:5080/api/Topics?assignedModule=${moduleGuid}`,
      { httpsAgent: agent }
    );

    const topics = res.data.filter(isTopic);

    return (
      <div>
        <h1>Themen zum Modul</h1>
        <TopicsClient topics={topics} moduleGuid={moduleGuid} />
        <h2>Neues Thema hinzufügen</h2>
        <TopicsAdd />
      </div>
    );
  } catch (error) {
    console.error("Fehler beim Laden der Topics:", error);
    return <p>Fehler beim Laden der Topics.</p>;
  }
}

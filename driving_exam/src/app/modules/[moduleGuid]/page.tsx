/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";
import { isModule } from "@/app/types/Module";
import { isTopic } from "@/app/types/Topic";
import TopicsClient from "./TopicsClient";

type Params = {
  moduleGuid: string;
};

export async function generateStaticParams() {
  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const res = await axios.get("https://localhost:5443/api/Modules", { httpsAgent: agent });
    const modules = res.data.filter(isModule);
    return modules.map((m: { guid: string }) => ({ moduleGuid: m.guid }));
  } catch {
    return [];
  }
}

export default async function ModuleTopicsPage({ params }: { params: Promise<Params> }) {
  const { moduleGuid } = await params;
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const res = await axios.get(
      `https://localhost:5443/api/Topics?assignedModule=${moduleGuid}`,
      { httpsAgent: agent }
    );

    const topics = (res.data as any[]).filter(isTopic);

    return <TopicsClient topics={topics} moduleGuid={moduleGuid} />;
  } catch (error) {
    console.error("Fehler beim Laden der Topics:", error);
    return <p>Fehler beim Laden der Topics.</p>;
  }
}

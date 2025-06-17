/* eslint-disable @typescript-eslint/no-explicit-any */
import TopicsClient from "../TopicsClient"; // bereits existierend
import axios from "axios";
import https from "https";
import { isTopic } from "@/app/types/Topic";

export default async function TopicsPage({ params }: { params: { moduleGuid: string } }) {
  const agent = new https.Agent({ rejectUnauthorized: false });

  const res = await axios.get(
    `https://localhost:5443/api/Topics?assignedModule=${params.moduleGuid}`,
    { httpsAgent: agent }
  );
  const topics = (res.data as any[]).filter(isTopic);

  return <TopicsClient topics={topics} moduleGuid={params.moduleGuid} />;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import TopicsClient from "../TopicsClient"; // bereits existierend
import axios from "axios";
import https from "https";
import { isTopic } from "@/app/types/Topic";
import TopicsAdd from "../TopicsAdd"; // bereits existierend

export default async function TopicsPage({ params }: { params: { moduleGuid: string } }) {
  const agent = new https.Agent({ rejectUnauthorized: false });

  // http://localhost:5080/api/Topics?assignedModule=${params.moduleGuid}
  const res = await axios.get(
    `http://localhost:5080/api/Topics?assignedModule=${params.moduleGuid}`,
    { httpsAgent: agent }
  );
  const topics = (res.data as any[]).filter(isTopic);

  return (
    <div>
      <TopicsClient topics={topics} moduleGuid={params.moduleGuid} />
      <TopicsAdd moduleGuid={params.moduleGuid}/> 
    </div>
  );
}

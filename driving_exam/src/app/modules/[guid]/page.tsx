/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosInstance } from "@/app/utils/apiClient";
import { isTopic } from "@/app/types/Topic";
import Link from "next/link";

export default async function TopicsPage({ params }: { params: { guid: string } }) {
  const response = await axiosInstance.get(`topics?assignedModule=${params.guid}`);
  const topics = response.data.filter(isTopic);

  return (
    <div>
      <h1>Themen</h1>
      <ul>
        {topics.map((topic: any) => (
          <li key={topic.guid}>
            <Link href={`/modules/${params.guid}/topics/${topic.guid}`}>{topic.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

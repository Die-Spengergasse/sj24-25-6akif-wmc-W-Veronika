"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../../utils/apiClient";
import { Topic, isTopic } from "../../types/Topic";

export default function TopicsPage({ params }: { params: { moduleGuid: string } }) {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    apiClient.get(`topics?assignedModule=${params.moduleGuid}`).then(res => {
      setTopics(res.data.filter(isTopic));
    });
  }, [params.moduleGuid]);

  return (
    <div>
      <h1>Themen</h1>
      <ul>
        {topics.map(t => (
          <li key={t.guid}>
            <Link href={`/modules/${params.moduleGuid}/topics/${t.guid}`}>{t.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

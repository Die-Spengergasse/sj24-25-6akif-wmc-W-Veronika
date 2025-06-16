"use client";
import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { apiClient } from "../../utils/apiClient";
import { Topic, isTopic } from "../../types/Topic";
import TopicAdd from "../../topics/TopicAdd";
import { useDrivingExamState } from "../../context/DrivingExamContext";

type TopicsPageState =
  | { dialog: "" }
  | { dialog: "edit"; topic: Topic }
  | { dialog: "delete"; topic: Topic }
  | { dialog: "error"; error: string };

function reducer(state: TopicsPageState, action: any): TopicsPageState {
  if (action.reset) return { dialog: "" };
  switch (action.type) {
    case "edit": return { dialog: "edit", topic: action.topic };
    case "delete": return { dialog: "delete", topic: action.topic };
    case "error": return { dialog: "error", error: action.error };
    default: return { dialog: "" };
  }
}

export default function TopicsPage({ params }: { params: { moduleGuid: string } }) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const { isAdmin } = useDrivingExamState();

  const reload = () => {
    apiClient.get(`topics?assignedModule=${params.moduleGuid}`).then(res => {
      setTopics(res.data.filter(isTopic));
    });
  };

  useEffect(() => {
    reload();
  }, [params.moduleGuid]);

  return (
    <div>
      <h1>Themen</h1>
      <TopicAdd moduleGuid={params.moduleGuid} onAdded={reload} />
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

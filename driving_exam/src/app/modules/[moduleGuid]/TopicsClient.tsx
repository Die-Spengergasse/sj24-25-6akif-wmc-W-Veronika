"use client";

import Link from "next/link";
import styles from "./style.module.css";
import { Topic } from "@/app/types/Topic";

type Props = {
  topics: Topic[];
  moduleGuid: string;
};

export default function TopicsClient({ topics, moduleGuid }: Props) {
  return (
    <div className={styles.topicsContainer}>
      <h1>Themen zum Modul</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.guid}>
            <Link href={`/modules/${moduleGuid}/topics/${topic.guid}`}>
              <a className={styles.topicName}>
                {topic.name} ({topic.questionCount} Fragen)
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

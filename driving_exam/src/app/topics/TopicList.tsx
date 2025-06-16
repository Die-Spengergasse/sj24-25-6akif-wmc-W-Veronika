import Link from "next/link";
import { Topic } from "../types/Topic";

export default function TopicList({ topics, moduleGuid }: { topics: Topic[], moduleGuid: string }) {
  return (
    <ul>
      {topics.map(t => (
        <li key={t.guid}>
          <Link href={`/modules/${moduleGuid}/topics/${t.guid}`}>{t.name}</Link>
        </li>
      ))}
    </ul>
  );
}

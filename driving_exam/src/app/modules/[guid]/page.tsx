import TopicList from "@/app/topics/TopicList";
import TopicAdd from "@/app/topics/TopicAdd";
import { getTopics } from "@/app/topics/topicApiClient";
import { isErrorResponse } from "@/app/utils/apiClient";

export default async function TopicsPage(props: { params: { guid: string } }) {
  const params = await props.params; // await wie in der Fehlermeldung verlangt
  const response = await getTopics(params.guid);

  if (isErrorResponse(response)) {
    return <div className="errorbox">{response.message || "Fehler beim Laden der Themen."}</div>;
  }

  if (Array.isArray(response) && response.length === 0) {
    return (
      <div>
        <h1>Themen</h1>
        <div className="errorbox">Für dieses Modul sind keine Themen vorhanden.</div>
        <h2>Thema hinzufügen</h2>
        <TopicAdd moduleGuid={params.guid} />
      </div>
    );
  }

  return (
    <div>
      <h1>Themen</h1>
      <TopicList topics={response} moduleGuid={params.guid} />
      <h2>Thema hinzufügen</h2>
      <TopicAdd moduleGuid={params.guid} />
    </div>
  );
}

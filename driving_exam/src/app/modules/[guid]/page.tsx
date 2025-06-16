import TopicList from "@/app/topics/TopicList";
import TopicAdd from "@/app/topics/TopicAdd";
import { getTopics } from "@/app/topics/topicApiClient";
import { isErrorResponse } from "@/app/utils/apiClient";

export default async function TopicsPage({ params }: { params: { moduleGuid: string } }) {
  const response = await getTopics(params.moduleGuid);

  return (
    <div>
      <h1>Themen</h1>
      {!isErrorResponse(response) ? (
        <div>
          <TopicList topics={response} moduleGuid={params.moduleGuid} />
          <h2>Thema hinzufügen</h2>
          <TopicAdd moduleGuid={params.moduleGuid} />
        </div>
      ) : (
        <div className="errorbox">{response.message}</div>
      )}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/app/utils/apiClient";
import { isQuestion } from "@/app/types/Question";

export default async function QuestionsPage({ params }: { params: { guid: string; topicGuid: string } }) {
  // params.guid = Modul-GUID, params.topicGuid = Topic-GUID
  const response = await axiosInstance.get(
    `questions?moduleGuid=${params.guid}&topicGuid=${params.topicGuid}`
  );
  const questions = response.data.filter(isQuestion);

  return (
    <div>
      <h1>Fragen</h1>
      <ul>
        {questions.map((q: any) => (
          <li key={q.guid} style={{ marginBottom: 32 }}>
            <div>
              <b>{q.text}</b>
              {q.imageUrl && (
                <div>
                  <img src={q.imageUrl} alt="Fragenbild" style={{ maxWidth: 200, margin: 10 }} />
                </div>
              )}
            </div>
            <ul>
              {q.answers.map((a: any) => (
                <li key={a.guid}>{a.text}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

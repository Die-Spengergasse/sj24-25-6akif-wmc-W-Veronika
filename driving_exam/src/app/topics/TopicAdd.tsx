"use client";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addTopic } from "./topicApiClient";
import styles from "./TopicAdd.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function TopicAdd({ moduleGuid }: { moduleGuid: string }) {
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await addTopic(new FormData(event.target as HTMLFormElement), moduleGuid);
    if (isErrorResponse(response))
      setError(response);
    else
      formRef.current?.reset();
  }

  useEffect(() => {
    if (error.message) { alert(error.message); }
  }, [error]);

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef} className={styles.topicAdd}>
        <div>
          <div>Name</div>
          <div><input type="text" name="name" required /></div>
          <div>{error.validations.name && <span className={styles.error}>{error.validations.name}</span>}</div>
        </div>
        <div>
          <div>&nbsp;</div>
          <div><button type="submit">Thema hinzufügen</button></div>
        </div>
      </form>
    </div>
  );
}

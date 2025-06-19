"use client";

import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addTopic } from "./topicsApiClient";
import styles from "./TopicsAdd.module.css";

interface TopicsAddProps {
  moduleGuid: string;
}

async function handleSubmit(
  event: FormEvent,
  setError: React.Dispatch<React.SetStateAction<ErrorResponse>>,
  formRef: RefObject<HTMLFormElement | null>,
  moduleGuid: string
) {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);
  const name = formData.get("name");

  const response = await addTopic(name as string, moduleGuid);

  if (isErrorResponse(response)) {
    setError(response);
  } else {
    setError(createEmptyErrorResponse());
    formRef.current?.reset();
  }
}

export default function TopicsAdd({ moduleGuid }: TopicsAddProps) {
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <form onSubmit={(e) => handleSubmit(e, setError, formRef, moduleGuid)} ref={formRef} className={styles.topicAdd}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" required minLength={1} maxLength={255} />
        {error.validations.name && <span className={styles.error}>{error.validations.name}</span>}
      </div>
      <button type="submit">Thema hinzufügen</button>
    </form>
  );
}

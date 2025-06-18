"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import { ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addTopic } from "./topicsApiClient";
import styles from "./TopicsAdd.module.css";

export default function TopicsAdd() {
  const [error, setError] = useState<ErrorResponse | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (error?.message) {
      alert(error.message);
    }
  }, [error]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const response = await addTopic(formData);

    if (response && isErrorResponse(response)) {
      setError(response);
    } else {
      setError(null);
      formRef.current?.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className={styles.topicAdd}>
      <div>
        <div>Name</div>
        <div>
          <input type="text" name="name" required minLength={1} maxLength={255} />
        </div>
        <div>{error?.validations?.name && <span className={styles.error}>{error.validations.name}</span>}</div>
      </div>

      <div>
        <div>&nbsp;</div>
        <div>
          <button type="submit">Thema hinzufügen</button>
        </div>
      </div>
    </form>
  );
}

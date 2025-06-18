"use client";

import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addModule } from "./modulesApiClient";
import styles from "./ModulesAdd.module.css";

async function handleSubmit(
  event: FormEvent,
  setError: React.Dispatch<React.SetStateAction<ErrorResponse>>,
  formRef: RefObject<HTMLFormElement | null>
) {
  event.preventDefault();
  const response = await addModule(new FormData(event.target as HTMLFormElement));
  if (isErrorResponse(response)) {
    setError(response);
  } else {
    setError(createEmptyErrorResponse());
    formRef.current?.reset();
  }
}

export default function ModulesAdd() {
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e, setError, formRef)} ref={formRef} className={styles.moduleAdd}>
        <div>
          <div>Nummer</div>
          <div>
            <input type="number" name="number" required min={1} max={999999} />
          </div>
          <div>{error.validations.number && <span className={styles.error}>{error.validations.number}</span>}</div>
        </div>

        <div>
          <div>Name</div>
          <div>
            <input type="text" name="name" required minLength={1} maxLength={255} />
          </div>
          <div>{error.validations.name && <span className={styles.error}>{error.validations.name}</span>}</div>
        </div>

        <div>
          <div>&nbsp;</div>
          <div><button type="submit">Modul hinzufügen</button></div>
        </div>
      </form>
    </div>
  );
}

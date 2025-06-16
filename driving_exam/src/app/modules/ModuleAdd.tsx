"use client";

import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addModule } from "./moduleApiClient";
import styles from "./ModuleAdd.module.css";
import { Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

async function handleSubmit(
  event: FormEvent,
  setError: Dispatch<SetStateAction<ErrorResponse>>,
  formRef: RefObject<HTMLFormElement | null>
) {
  event.preventDefault();
  const response = await addModule(new FormData(event.target as HTMLFormElement));
  if (isErrorResponse(response))
    setError(response);
  else
    formRef.current?.reset();
}

export default function ModuleAdd() {
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (error.message) { alert(error.message); }
  }, [error]);

  return (
    <div>
      <form onSubmit={e => handleSubmit(e, setError, formRef)} ref={formRef} className={styles.moduleAdd}>
        <div>
          <div>Name</div>
          <div><input type="text" name="name" required /></div>
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

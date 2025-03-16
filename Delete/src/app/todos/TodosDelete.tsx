import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalDialog from "../components/ModalDialog";
import { TodoItem } from "../types/TodoItem";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "../utils/apiClient";
import { deleteTodo } from "./todosApiClient";

type TodosDeleteProps = {
  todo: TodoItem;
  onCancel: () => void;
  onDeleted: () => void;
};

async function handleSubmit(
  todoGuid: string,
  deleteTasks: boolean,
  setError: Dispatch<SetStateAction<ErrorResponse>>,
  onDeleted: () => void
) {

  console.log("Lösche Todo mit GUID:", todoGuid, "Delete Tasks:", deleteTasks); // Debugging

  const response = await deleteTodo(todoGuid, deleteTasks);
  if (isErrorResponse(response)) {
    setError(response);
  } else {
    onDeleted();
  }
}

export default function TodosDelete({ todo, onCancel, onDeleted }: TodosDeleteProps) {
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
  const [deleteTasks, setDeleteTasks] = useState(false);

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <ModalDialog
      title={`Delete Todo ${todo.title}`}
      onCancel={onCancel}
      onOk={() => handleSubmit(todo.guid, deleteTasks, setError, onDeleted)}
    >
      <p>Möchtest du das Todo "{todo.title}" wirklich löschen?</p>
      <label>
        <input
          type="checkbox"
          checked={deleteTasks}
          onChange={(e) => setDeleteTasks(e.target.checked)}
        />
        Auch verbundene Tasks löschen
      </label>
    </ModalDialog>
  );
}

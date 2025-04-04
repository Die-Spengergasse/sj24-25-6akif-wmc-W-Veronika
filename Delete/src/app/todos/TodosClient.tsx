"use client";

import { useReducer, useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";
import TodosDelete from "./TodosDelete";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

// Discriminated union für den Reducer
type DeleteReducerAction =
  | { type: null; todo: null }
  | { type: "delete"; todo: TodoItem };

type DeleteState =
  | { actionType: null; todo: null }
  | { actionType: "delete"; todo: TodoItem };

function deleteReducer(state: DeleteState, action: DeleteReducerAction): DeleteState {
    switch (action.type) {
        case "delete":
            return { actionType: "delete", todo: action.todo };
        default:
            return { actionType: null, todo: null };
    }
}

export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [deleteState, dispatchDelete] = useReducer(deleteReducer, { actionType: null, todo: null });

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const filteredTodoItems = selectedCategory
        ? todoItems.filter(item => item.categoryName === selectedCategory)
        : todoItems;

    return (
        <div className={styles.categories}>
            <h1>Todo Liste</h1>
            <select onChange={handleCategoryChange}>
                <option value="">Alle Kategorien</option>
                {categories.map(category => (
                    <option key={category.guid} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            <ul>
                {filteredTodoItems.map(item => (
                    <li
                        key={item.guid}
                        className={
                            new Date(item.dueDate) < new Date() ? styles.overdue : styles.onTime
                        }
                    >
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Kategorie: {item.categoryName} (GUID {item.categoryGuid})</p>
                        <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                        <button onClick={() => dispatchDelete({ type: "delete", todo: item })}>
                            🗑️ Löschen
                        </button>
                    </li>
                ))}
            </ul>

            {deleteState.actionType === "delete" && deleteState.todo && (
                <TodosDelete
                    todo={deleteState.todo}
                    onCancel={() => dispatchDelete({ type: null, todo: null })}
                    onDeleted={() => {
                        dispatchDelete({ type: null, todo: null });
                        window.location.reload(); //UI sofort aktualisieren
                    }}
                />
            )}
        </div>
    );
}

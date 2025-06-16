"use client";
import { useState } from "react";
import { apiClient } from "../utils/apiClient";

export default function TopicAdd({ moduleGuid, onAdded }: { moduleGuid: string, onAdded?: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiClient.post("topics", { name, moduleGuid });
      setName("");
      onAdded?.();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).join(", "));
      } else if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Unbekannter Fehler");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "1em 0" }}>
      <input
        type="text"
        placeholder="Themenname"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <button type="submit">Thema hinzufügen</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}

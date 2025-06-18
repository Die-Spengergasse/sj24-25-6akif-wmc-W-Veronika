import axios from "axios";
import https from "https";
import { isModule } from "../types/Module";
import ModulesClient from "./ModulesClient";
import ModulesAdd from "./ModulesAdd";

export default async function ModulesPage() {
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const response = await axios.get("http://localhost:5080/api/Modules", { httpsAgent: agent });
    const modules = response.data.filter(isModule);

    return (
      <div>
        <h1>Module</h1>
        <ModulesClient modules={modules} />
        <h2>Neues Modul hinzufügen</h2>
        <ModulesAdd />
      </div>
    );
  } catch (error) {
    console.error("Fehler beim Laden der Module:", error);
    return <p>Fehler beim Laden der Module.</p>;
  }
}

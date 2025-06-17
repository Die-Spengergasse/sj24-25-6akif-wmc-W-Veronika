import axios from "axios";
import https from "https";
import { isModule } from "../types/Module";
import ModulesClient from "./ModulesClient";

export default async function ModulesPage() {
  const agent = new https.Agent({ rejectUnauthorized: false });

  try {
    const response = await axios.get("https://localhost:5443/api/Modules", { httpsAgent: agent });
    const modules = response.data.filter(isModule);

    return <ModulesClient modules={modules} />;
  } catch (error) {
    console.error("Fehler beim Laden der Module:", error);
    return <p>Fehler beim Laden der Module.</p>;
  }
}

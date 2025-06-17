# Erstellen einer Todo-App mit Next.js und TypeScript

![](./todo_first_app_1748.png)

> Download der App: [First_App20241118.zip](./First_App20241118.zip).
> Im Repo ist die App im Ordner *30_TodoApp/First_App*.
> Vergiss nicht, *npm install* nach dem Download im Ordner, wo die Datei *package.json* ist, auszuführen.

Im Kapitel Typescript haben wir bereits auf unser [Backend](01_Backend.md) zugegriffen, um Daten zu laden.
Stelle daher sicher, dass es läuft.
Nun wollen wir die erste SPA (single page app) schreiben, die die Ausgabe in den Browser bringt.

## Was ist Next.js und React?

*React* wurde 2013 von Facebook (jetzt Meta) veröffentlicht, ursprünglich entwickelt, um die wachsenden Anforderungen an interaktive und dynamische Benutzeroberflächen in ihren Anwendungen wie Facebook und Instagram zu bewältigen. React brachte mit der Einführung des virtuellen DOM und des komponentenbasierten Ansatzes eine Revolution in der Art und Weise, wie Entwickler UIs erstellen. Es ermöglichte effizientes Rendern von Änderungen und erleichterte die Wartung großer Anwendungen. Mit der Zeit entwickelte sich React zu einem der beliebtesten JavaScript-Frameworks für die Frontend-Entwicklung und bildet heute die Basis für viele moderne Webanwendungen weltweit.

*Next.js* wurde 2016 von Vercel (früher ZEIT) entwickelt und veröffentlicht, um das Arbeiten mit React zu vereinfachen und zu erweitern. Es wurde geschaffen, um die Lücken in React zu schließen, indem es serverseitiges Rendering (SSR) und statische Seitengenerierung (SSG) "out of the box" bietet. Next.js hat schnell an Beliebtheit gewonnen, weil es die Entwicklung von performanten und SEO-freundlichen Webanwendungen erleichtert, ohne dass Entwickler zusätzliche Konfigurationen für Routing oder Rendering vornehmen müssen. Seit seiner Veröffentlichung hat Next.js zahlreiche neue Funktionen hinzugefügt, darunter API-Routen, Bildoptimierung und integrierte Unterstützung für TypeScript, was es zu einem der führenden React-Frameworks für moderne Webanwendungen gemacht hat.

## Erstellen eine neuen Next.js App

Erstelle mit dem folgendem Befehl in der Konsole ein neues Next.js Projekt mit TypeScript.
Es wird automatisch ein Ordner *todo-app* erstellt, d. h. du führst den Befehl in der Konsole im Verzeichnis darüber aus.

Um das Skript *create-next-app* zur Verfügung zu haben, muss einmalig das Paket global installiert werden:

```
npm install -g create-next-app
```

Danach kann im Zielordner mit der Erstellung der ersten App begonnen werden.

```bash
npx create-next-app@latest todo-app --typescript
```

Beantworte die Fragen zur Einrichtung wie folgt.
Wir wollen nicht den App Router, sondern den Router von Next.js verwenden.
Deswegen beantworten wir die Frage mit *No*.

```
npx create-next-app@latest todo-app --typescript
√ Would you like to use ESLint? ...                               No / Yes <-- YES
√ Would you like to use Tailwind CSS? ...                         No / Yes <-- YES
√ Would you like to use *src/* directory? ...                     No / Yes <-- YES
√ Would you like to use App Router? (recommended) ...             No / Yes <-- YES
√ Would you like to use Turbopack for next dev? ...               No / Yes <-- NO
√ Would you like to customize the default import alias (@/*)? ... No / Yes <-- NO
```

### Überblick über das Next.js Projekt

Nach der Initialisierung findest du die folgenden Dateien und Ordner:

- **src/app/page.tsx**: Dies ist die Indexpage, sie wird aufgerufen, wenn die Root Adresse (/) aufgerufen wird.
- **src/app/globals.css**: Dies ist das Haupt Stylesheet der Applikation.
- **src/app/layout.tsx**: Hier wird das Grundlayout definiert.
  Es ist der "HTML Boilerplate Code".
  In *{children}* werden die einzelnen Seiten eingesetzt.
- **public/**: Statische Dateien wie Bilder, Icons oder andere Ressourcen werden hier abgelegt.
- **next.config.js**: Diese Datei enthält die Konfiguration von Next.js. Hier kannst du spezifische Einstellungen für dein Projekt anpassen.
- **tsconfig.json**: Hier werden die TypeScript-Konfigurationen festgelegt.
- **package.json**: Diese Datei listet alle Abhängigkeiten des Projekts sowie Skripte zum Bauen, Starten und Entwickeln.

### Installieren der notwendigen Pakete

Installiere *axios*, um HTTP-Anfragen an das Backend zu stellen:

```bash
npm install axios
```

## Konfiguration des Linters

Wie in unseren Typescript Projekten wollen wir die Option *no-explicit-any* zentral setzen.
Das können wir in der Datei *.eslintrc.json* machen:

**.eslintrc.json**
```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off"
  }
}
```

## Erstellen der TypeScript Interfaces

Erstelle im Ordner *src/app/types* eine Datei *TodoItem.ts* für die Todo-Items:

**src/app/types/TodoItem.ts**
```typescript
export interface TodoItem {
  guid: string;
  title: string;
  description: string;
  categoryName: string;
  categoryPriority: string;
  categoryIsVisible: boolean;
  isCompleted: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export function isTodoItem(item: any): item is TodoItem {
  return (
    typeof item === "object" &&
    "guid" in item &&
    "title" in item &&
    "description" in item &&
    "categoryName" in item &&
    "categoryPriority" in item &&
    "categoryIsVisible" in item &&
    "isCompleted" in item &&
    "dueDate" in item &&
    "createdAt" in item &&
    "updatedAt" in item
  );
}
```

Erstelle eine weitere Datei *Category.ts* für die Kategorien:

**src/app/types/Category.ts**
```typescript
export interface Category {
  guid: string;
  name: string;
  description: string;
  isVisible: boolean;
  priority: string;
  ownerName: string;
}

export function isCategory(item: any): item is Category {
  return (
    typeof item === "object" &&
    "guid" in item &&
    "name" in item &&
    "description" in item &&
    "isVisible" in item &&
    "priority" in item &&
    "ownerName" in item
  );
}
```

### Erklärung des TypeScript Codes

- **TodoItem Interface**: Dieses Interface definiert die Struktur eines Todo-Items, die wir vom Backend erhalten.
- **isTodoItem Type Guard**: Dies ist ein sogenannter "Type Guard", der sicherstellt, dass ein Objekt den Typ *TodoItem* hat.
- **Category Interface**: Dieses Interface beschreibt die Struktur einer Kategorie. Auch hier nutzen wir einen "Type Guard" mit *isCategory*.

## Erstellen der Datei layout.tsx

Wie bei jeder Webseite beginnen wir mit dem HTML Grundgerüst.
Die Funktion *RootLayout()* liefert dieses Gerüst zurück.
In *{children}* werden die einzelnen *Pages* eingesetzt, in unserem Fall die Datei *page.tsx*.

**src/app/layout.tsx**
```tsx
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My first Next.js App"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

## Erstellen der Indexpage der App

Öffne *src/app/page.tsx* und füge den folgenden Code ein:

**src/app/page.tsx**
```tsx
"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import https from "https";
import { TodoItem, isTodoItem } from "./types/TodoItem";
import { Category, isCategory } from "./types/Category";

export default function Home() {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Wenn wir im Dropdownfeld eine Kategorie auswählen, sollen nur die Todo Items dieser Kategorie angezeigt werden.
  const filteredTodoItems = selectedCategory
    ? todoItems.filter(item => item.categoryName === selectedCategory)
    : todoItems;

  useEffect(() => {
    // Da wir axios.get mit await verwenden, muss diese Funktion async sein.
    async function fetchData() {
      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      try {
        // Todo Items abrufen
        const todoResponse = await axios.get("https://localhost:5443/api/TodoItems", { httpsAgent: agent });
        const filteredTodos = todoResponse.data.filter(isTodoItem);
        setTodoItems(filteredTodos);

        // Kategorien abrufen, um das Dropdownfeld zu befüllen.
        const categoryResponse = await axios.get("https://localhost:5443/api/Categories", { httpsAgent: agent });
        const filteredCategories = categoryResponse.data.filter(isCategory);
        setCategories(filteredCategories);
      } catch (error) {
        console.error(error);
      }
    };
    // Die Funktion wird ohne await aufgerufen. Bei useEffect können wir keine async Funktion übergeben.
    // Siehe https://react.dev/reference/react/useEffect#fetching-data-with-effects
    fetchData();
  }, []);

  return (
    <div>
      <h1>Todo Liste</h1>
      <select onChange={(event)=>setSelectedCategory(event.target.value)}>
        <option value="">Alle Kategorien</option>
        {categories.map(category => (
          <option key={category.guid} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <ul>
        {filteredTodoItems.map(item => (
          <li key={item.guid}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p>Kategorie: {item.categoryName}</p>
            <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
            <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Erläuterung des Codes

- **useState**: Mit diesem Hook erstellen wir lokale State-Variablen. *todoItems* speichert die Liste der Todo-Items, *categories* die Kategorien und *selectedCategory* speichert die aktuell ausgewählte Kategorie.
- **useEffect**: Dieser Hook führt seiteneffektreiche Aktionen aus, wie z.B. das Abrufen von Daten. Beim Laden der Seite ruft *useEffect* die Daten von den beiden API-Endpunkten ab und speichert sie im State.
- **axios.get()**: Hiermit werden HTTP GET-Anfragen an die API gesendet. Die Antworten werden in den jeweiligen State-Variablen gespeichert.
- **handleCategoryChange**: Diese Funktion wird aufgerufen, wenn der Benutzer eine Kategorie aus dem Dropdown-Menü auswählt. Die ausgewählte Kategorie wird im State gespeichert und die Liste der Todo-Items wird entsprechend gefiltert.
- **isTodoItem & isCategory**: Diese Type Guards stellen sicher, dass die vom Backend erhaltenen Daten die erwarteten Strukturen haben, bevor sie in den State gespeichert werden.
- **use client**: Standardmäßig werden Komponenten von Next.js am Server gerendert.
  Wollen wie Userinteraktion, muss die Komponente allerdings am Client gerendert werden.
  Details sind im nächsten Kapitel zu finden.

#### Wie funktioniert useState<TodoItem[]>([])?

Der React-Hook useState wird verwendet, um den internen State einer Komponente zu verwalten. Wenn wir *useState<TodoItem[]>([])* verwenden, initialisieren wir den State als ein leeres Array, das vom Typ *TodoItem[]* ist – also ein Array von TodoItem-Objekten.

```typescript
const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
```

- **todoItems:** Dies ist die State-Variable, die die Todo-Items enthält.
- **setTodoItems:** Diese Funktion wird verwendet, um den Wert von todoItems zu aktualisieren.

Der Hook erwartet den Typ der State-Variable, also ein Array von TodoItem. Der Startwert ist ein leeres Array *[]*.
Durch die Verwendung des Typs *TodoItem[]* weiß TypeScript, dass wir in der todoItems-Variable eine Liste von TodoItem-Objekten speichern.
Dies stellt sicher, dass wir später sicher auf die Eigenschaften dieser Objekte zugreifen können, z.B. item.title oder item.description.

#### Was macht useEffect genau?

Der Hook useEffect wird in React verwendet, um Nebenwirkungen (engl. "side effects") in funktionalen Komponenten zu behandeln, wie z.B. das Abrufen von Daten, das Abonnieren von Ereignissen oder das direkte Manipulieren des DOMs, die nicht innerhalb der normalen Ausführung des Renderings stattfinden sollten.


```typescript
useEffect(() => {
  // Abrufen von Todo Items und Kategorien
}, []);
```

#### Wann wird useEffect aufgerufen?

useEffect wird immer dann aufgerufen, wenn die Komponente gerendert wird. In unserem Fall haben wir ein leeres Abhängigkeitsarray [] als zweiten Parameter angegeben, was bedeutet, dass der Effekt nur einmal beim ersten Rendern der Komponente ausgeführt wird.
Wenn wir bestimmte Variablen in das Abhängigkeitsarray aufnehmen (z.B. *[selectedCategory]*), würde useEffect bei jeder Änderung dieser Variablen erneut ausgeführt.
Wofür wird useEffect in unserem Fall genutzt?

Es wird verwendet, um die Todo-Items und Kategorien von der API zu laden, wenn die Seite das erste Mal gerendert wird. Die Daten werden dann im State der Komponente gespeichert.

## CSS Layout für die App

Um das Layout der App zu verbessern, erstellen wir eine einfache CSS-Datei. Gehe zu *src/app/globals.css* und füge den folgenden Inhalt ein:

**src/app/globals.css**
```css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
}

h1 {
  text-align: center;
  color: #333;
}

select {
  display: block;
  margin: 20px auto;
  padding: 10px;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  margin: 10px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

li h2 {
  margin: 0;
  font-size: 20px;
  color: #0070f3;
}

li p {
  margin: 5px 0;
  color: #666;
}
```

## Die fertige Dateistruktur

Am Ende soll die Dateistruktur so aussehen.
Achte darauf, dass im Ordner *src* nur der Ordner *app* ist.

```
todo-app
  + .eslintrc.json
  + next.config.ts
  + package.json
  + public
  + src
  |  + app
  |  |  + globals.css
  |  |  + layout.tsx
  |  |  + page.tsx
  |  |  + types
  |  |  |  + Category.ts
  |  |  |  + TodoItem.ts
  + tailwind.config.ts
  + tsconfig.json
```

## Starte des Entwicklungsservers

Führe den folgenden Befehl aus, um den Entwicklungsserver zu starten:

```bash
npm run dev
```

Öffne deinen Browser und gehe zu *http://localhost:3000*. Du solltest nun eine Todo-Liste sehen, die Daten vom Backend abruft und eine Filterfunktion nach Kategorien bietet.


## Exportieren der App

Editiere die Datei **next.config.ts** und füge folgenden Inhalt ein:

```javascript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export"
};

export default nextConfig;
```

Die Option *output: "export"* legt ein *out* Verzeichnis mit der App an. Mit

```
npm run build
```

kann die App nun erstellt und in dieses Verzeichnis geschrieben werden.
Es kann nun auf einem Webserver gehostet werden.


# Layout, Komponenten und Routen


![](todo_pages_0938.png)

> Link zum Programm: [Laout_Routing20241212.zip](Laout_Routing20241212.zip), im Repo unter *30_TodoApp/Laout_Routing*.  
> Wichtig: Diese Informationen beziehen sich auf das Routingsystem in Next.js 15.
> Es wurde in der Version 13 angepasst, kontrolliere daher in Tutorials immer die Version!

Im vorigen Beispiel haben wir in der Datei *src/pages/index.tsx* unsere gesamte Applikation gepackt.
Das CSS wurde in *src/styles/global.css* hinterlegt.
Bei größeren Projekten führt uns dieser Ansatz zu großen Problemen:
- Wir brauchen ein zentrales Layout mit einer Navbar, und die verschiedenen Pages sollen z. B. im main Bereich dargestellt werden.
- Wir wollen den CSS Code aufteilen.
- Wir wollen mehrere Pages erstellen, die unter unterschiedlichen Adressen erreicht werden sollen.

Deswegen ist eines der Kernzonzepte jedes SPA Frameworks das *Routingsystem*.

## Definition eines zentralen Layouts

Zuerst erstellen wir einen Ordner *src/app*. Der *app* Ordner ist von zentraler Bedeutung.
Hier legen wir eine Datei *layout.tsx* mit folgendem Inhalt an:

**src/app/layout.tsx**
```tsx
import Navbar from "@/app/components/Navbar";
import './globals.css'; // Importiere die globale CSS-Datei

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                {/* Favicon als Base64-encoded SVG */}
                <link
                    rel="icon"
                    href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNNCAxMmw0IDQgOC04IiAvPjwvc3ZnPg=="
                    type="image/svg+xml"
                />
                <title>To-Do App</title>
            </head>
            <body>
                <div className="container">
                    <Navbar />
                    <main className="content">{children}</main>
                </div>
            </body>
        </html>
    );
}
```

Dies exportiert die Funktion *RootLayout*.
Sie bildet den Startpunkt der HTML Darstellung.
Deswegen wird auch im TSX Code ein vollständiges HTML Gerüst zurückgeliefert.
2 Dinge sind neu:

- Es wird *{children}* verwendet.
  Hier werden dann die Unterseiten "hineingesetzt".
- Mit *Navbar* verwenden wir die erste eigene Komponente.
  Komponenten sind Puzzlesteine, die von Next.js an diese Stelle gesetzt werden.

## Die Komponente Navbar

Wie sieht so eine Komponente aus?
Sie ist vom Aufbau her ident mit unserer ersten Page.
Den Unterschied macht aber die Verwendung: Solche Komponenten werden in Pages eingebettet und nicht direkt "angewählt".
Next.js rendert standardmäßig die Komponenten am Server und sendet den HTML Code an den Browser.
Da wir aber clientseitige Aktionen wie das Abfragen der Adressleiste (mit *usePathname*) machen müssen, müssen wir mit *use client* sagen, dass diese Komponente im Browser mit JavaScript gerendert wird.

Danach werden die Styles eingebunden.
Dafür wird eine Datei *Laout_Routing/src/app/components/Navbar.module.css* mit [diesem CSS](./Laout_Routing/src/app/components/Navbar.module.css) angelegt. Dies nennt sich *CSS Modules* in Next.js.

> Wichtig: Du musst im TSX den Klassennamen mit className zuweisen und davor den Style mit *import* einbinden.


**src/app/components/Navbar.tsx**
```tsx
'use client'  // Da wir usePathname vom Router verwenden.

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname(); // Aktuellen Pfad abrufen

    return (
        <nav className={styles.nav}>
            <Link
                href="/"
                className={pathname === '/' ? styles.active : ''}
            >
                Home
            </Link>
            <Link
                href="/todos"
                className={pathname === '/todos' ? styles.active : ''}
            >
                Todos
            </Link>
            <Link
                href="/about"
                className={pathname === '/about' ? styles.active : ''}
            >
                About
            </Link>
        </nav>
    );
}
```

## Die Startpage

Wenn wir mit der Root Adresse (/) auf die App zugreifen, wird die Home Page geladen.
Dafür legen wir im *src/app* Ordner eine Datei *page.tsx* an.

**src/app/page.tsx**

```tsx
export default function Home() {
    return (
        <div className="home">
        <h1>Welcome to todo-app</h1>
        <p>
            Dies ist die Datei page.tsx. Sie wird geladen, wenn keine Route angegeben wird.
            Klicke auf einen Punkt im Menü.
        </p>
        </div>
    )
}
```

## Routing in Next.js (ab 13)

Wir wollen nun auf die Adressen */about* und */todos* reagieren.

### Anlegen der about Page

Wir legen im Ordner *src/app* ein Verzeichnis *about* an.
Darin legen wir die Datei *page.tsx* an.
Sie wird automatisch geladen, wenn die Adresse */about* angefordert wird:

**src/app/about/page.tsx**
```tsx
export default function AboutPage() {
    return (
        <div className="about">
            <h1>About</h1>
            <p>
                Dies ist ein Frontend für das Todo Backend.
                Es zeigt den Einsatz von Next.js 15 im WMC Unterricht.
            </p>
        </div>
    )
}
```

### Anlegen der todos Page

In dieser Page wollen wir auch ein eigenes CSS einbinden.
Dieser Code war vorher im globalen Stylesheet, nun wollen wir es nur für die todos Page verwenden.
Deswegen wird in *todos/style.module.css* ein CSS Module mit [diesem CSS Code](./Laout_Routing/src/app/todos/style.module.css) erstellt.

#### Server- und clientseitig gerenderte Komponenten treffen aufeinander

Die todos Page holt sich Daten von der API mit *axios*.
Dieser Aufruf ist asynchron.
Davor haben wir ein *Promise* verwendet, um keine *async* Methode definieren zu müssen.

Damit wir *async* und *await* verwenden können, müssen wir wissen, dass es *servergerenderte* und *clientgerenderte* Komponenten gibt.
Beim Laden von einer API ist es best practice, die Daten in einer *serverseitigen* Komponente zu laden.
Erst wenn die Daten vorhanden sind, werden sie über Parameter einer *clientseitigen* Komponente übergeben.

> Das Darstellen einer clientseitigen Komponente sollte möglichst schnell durchgeführt werden können.
> Deswegen sollten keine API Aufrufe dort statt finden.

Um das zu erreichen, legen wir zuerst in der Datei *page.tsx* den *serverseitigen* Teil an.

**src/app/todos/page.tsx**

```tsx
import axios from "axios";
import https from "https";
import TodosClient from "./TodosClient";
import { isTodoItem } from "../types/TodoItem";
import { isCategory } from "../types/Category";

export default async function TodosPage() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // Categories laden, um das Dropdown befüllen zu können.
  const categoriesResponse = await axios.get("https://localhost:5443/api/Categories", { httpsAgent: agent });
  const categories = categoriesResponse.data.filter(isCategory);

  // TodoItems laden, um die Items anzeigen zu können
  const todoItemsResponse = await axios.get("https://localhost:5443/api/TodoItems", { httpsAgent: agent });
  const todoItems = todoItemsResponse.data.filter(isTodoItem);


  return <TodosClient todoItems={todoItems} categories={categories} />;
}
```

Beachte den Aufruf von *TodosClient*. Es werden 2 *Parameter (Props)* übergeben.

Nun erstellen wir in *TodosClient.tsx* die clientseitige Komponente.
Im Prototypen von *TodosClient* werden die übergebenen Parameter geschrieben.
Nun können wir mit den fertigen Daten die Komponente *clientseitig* rendern.

**src/app/todos/TodosClient.tsx**
```tsx
'use client';

import { useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");

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
                        <p>Kategorie: {item.categoryName}</p>
                        <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## Dateiübersicht der Muster App

```
Layout_Routing
  + .eslintrc.json
  + next.config.ts
  + package.json
  + postcss.config.mjs
  + public
  + src
  |  + app
  |  |  + about
  |  |  |  + page.tsx
  |  |  + components
  |  |  |  + Navbar.module.css
  |  |  |  + Navbar.tsx
  |  |  + globals.css
  |  |  + layout.tsx
  |  |  + page.tsx
  |  |  + todos
  |  |  |  + page.tsx
  |  |  |  + style.module.css
  |  |  |  + TodosClient.tsx
  |  |  + types
  |  |  |  + Category.ts
  |  |  |  + TodoItem.ts
  + tailwind.config.ts
  + tsconfig.json
```

## Übung

Beim Klick auf die Überschrift eines Todo Items in der Page *todos* soll eine Seite geöffnet werden, die alle *Todo Tasks* dieses Todo Items darstellt.
Dafür brauchst du *dynamisches Routing*.
Es ist in der Doku von Next.js unter [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes) erklärt.
Du musst also in *src/app/todos* einen ordner *[id]* anlegen.
In diesem Ordner erstellst du eine *page.tsx* Datei, die den Parameter *id* ausliest.
Dort steht die GUID des TodoItems.
Mit *https://localhost:5443/api/TodoItems/(id)* kannst du von der API die Detailinfos zum Todo Item vom Server laden.
Es beinhaltet ein Array *todoTasks*, das alle Tasks anbietet.
Stelle diese Tasks in einer clientseitigen Component dar.

Gehe dabei so vor:
- Lade als Basisimplementierung die Datei [Laout_Routing20241212.zip](Laout_Routing20241212.zip) aus dem Repo.
- Definiere ein Interface *TodoItemDetail* in *src/app/types*.
  Es soll die Antwort, die z. B. von https://localhost:5443/api/TodoItems/3b33199e-bc34-7895-eb67-338383c35c99 kommt, aufnehmen.
  Vergiss nicht auf den Typeguard.
- Lege in *src/app/todos* die entsprechenden Dateien und Verzeichnisse für das dynamische Routing an.
- In der Component *src/app/todos/[id]/page.tsx* wird der API Request vom Server geladen.
  Dann wird die clientseitige Component eingebunden. Es wird ein Array von *TodoItemDetail* Instanzen übergeben.


# Formulare und POST Requests: Daten einfügen

![](./todo_add_2006.png)

> Link zum Programm: [Add_Form20241212.zip](./Add_Form20241212.zip), im Repo unter *30_TodoApp/Add_Form*.  
 
## Daten an die API senden: der POST Request

Wenn wir die API des Todo Backends starten, können wir Swagger auf *https://localhost:5443/swagger/index.html* abrufen.
Bis jetzt haben wir nur von der API mit einem *GET* Request gelesen.
Möchten wir neue Daten einfügen, so müssen wir einen *POST* Request absetzen.
Dies können wir auch in Swagger, indem wir auf *POST /api/Categories* klicken.

Zusätzlich müssen wir Daten an die API senden, schließlich muss sie ja wissen, was wir eintragen möchten.
Die Daten werden im JSON Format angegeben.
Um eine neue Kategorie zu erstellen, können wir z. B. folgende Daten senden:

```json
{
  "name": "New category",
  "description": "A new category",
  "isVisible": true,
  "priority": "Low"
}
```

Die API nimmt diese Daten entgegen und schickt uns als Ergebnis *201 Created*.
Es ist ein Success Code, alles hat funktioniert.

![](./post_categories_success_1809.png)

Was aber, wenn unsere Daten falsch sind?
Wenn wir einen Datensatz mit leerer Beschreibung senden, wird die API mit *400 bad request* die Anfrage ablehnen.
Codes, die mit 4 beginnen bedeuten, dass der Fehler bei den Clientdaten liegt und wir den Request nicht unverändert wiederholen sollen.

```json
{
  "name": "New category",
  "description": "",
  "isVisible": true,
  "priority": "Low"
}
```

![](./post_categories_error1_1810.png)

Sehen wir uns die Antwort genauer an.
ASP.NET Core sendet im Property *errors* ein Objekt.
Darin ist jedes fehlerhafte Property als Key eingetragen, in diesem Fall *Description*.
Ein Array gibt die genauere Validierungsmeldung aus.
Dies brauchen wir dann, um dem User das Problem zurück zu melden.

Senden wir nun offensichtlich korrekte Daten nochmals an die API:

```json
{
  "name": "New category",
  "description": "A new category",
  "isVisible": true,
  "priority": "Low"
}
```

![](./post_categories_error2_1810.png)

Die API reagiert erneut mit *400 bad request*.
Dies entsteht, da ein Kategorienname nur 1x vergeben werden darf.
Die Antwort ist allerdings anders aufgebaut, es ist nur eine Textmeldung.

> Unsere API liefert bei Validierungsfehlern ein *errors* object.
> Bei allgemeinen Fehlern liefert sie nur Text.
> Wir müssen dies am Client berücksichtigen.

## Eine Hilfsdatei für API Requests

Bis jetzt wurde direkt in der Page die Daten von der API angefordert.

```typescript
export default async function TodosPage() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // Categories laden, um das Dropdown befüllen zu können.
  const categoriesResponse = await axios.get("https://localhost:5443/api/Categories", { httpsAgent: agent });
  const categories = categoriesResponse.data.filter(isCategory);
  // ...
  return <TodosClient todoItems={todoItems} categories={categories} />;
}
```

Bei größeren Projekten ergeben sich jedoch Nachteile:
- Es wird die absolute URL des Devservers (localhost) verwendet.
  Wollen wir sie ändern, müssen wir jede Komponente durchsehen.
- Konfigurationen wie das Setzen des Agents werden jedes mal wiederholt.
- Es wird keine Fehlerbehandlung durchgeführt.
  Falls die API nicht erreichbar ist, entsteht ein Laufzeitfehler.

Wir brauchen daher eine zentrale Datei, mit der wir eine Instanz von axios zentral konfigurieren.
Eine solche Datei legen wir in *src/app/utils/apiClient.ts* an.

**Quellcode: [src/app/utils/apiClient.ts](./Add_Form/src/app/utils/apiClient.ts)**

Zuerst wird ein Objekt *axiosInstance* exportiert.
Es wird mit der gewünschten Konfiguration zentral erstellt.
Somit müssen wir nur an dieser Stelle etwas ändern, falls sich die URL, etc. ändern sollte.

Falls ein API Aufruf fehlerhaft ist, was vor allem bei POST Requests aufgrund falsch übermittelter Daten sein kann, definieren wir einen eigenen type für die Antwort der API:

```typescript
export type ErrorResponse = {
    status: number;
    message: string;
    validations: Record<string, string>;
};
```

Er bildet die Antwort der API, die oben in den Screenshots gezeigt wurde, ab.

Die Funktion *createErrorResponse* hat folgende Aufgabe:
ASP.NET Core sendet wie beschrieben ein Objekt, das die Validierungsfehler beinhaltet.
Diese Funktion prüft die Antwort des Servers:
- Liefert der Server gar keine Rückmeldung, wird *Der Server ist nicht erreichbar.* als Nachricht geschrieben.
  Das ist dann der Fall, wenn der Server netzwerkmäßig nicht erreichbar ist.
- Liefert der Server einen Statuscode, aber keine genaueren Daten, wird die Meldung *Der Server lieferte HTTP xx.* geschrieben.
  Das ist dann der Fall, wenn ein z. B. *internal Server Error (500)* auftritt.
- Liefert der Server einen einfachen Text zurück, wird dieser in *message* geschrieben.
  Das ist dann der Fall, wenn unsere API einen nicht spezifischen Fehler der übergebenen Daten meldet.
- Liefert der Server ein *errors* Objekt, wird dieses mit kleingeschriebenen Properties in *validations* geschrieben.

## Bündeln aller Requests in einem TS File

Nun wollen wir die Struktur weiter optimieren.
Wir legen eine Datei */src/app/categories/categoryApiClient.ts* an.
Diese Datei beinhaltet die Funktionen, die von den Komponenten in diesem Ordner zur Kommunikation mit der API benötigt werden.

**Quellcode: [src/app/categories/categoryApiClient.ts](./Add_Form/src/app/categories/categoryApiClient.ts)**

*getCategories* liest über unser vorkonfiguriertes *axiosInstance* Objekt von der API.
Wir geben daher nur den Teil nach *localhost:5443/api* an, also *categories*.
Die Funktion liefert ein Promise vom Typ *Category[]* oder *ErrorResponse* zurück, je nach dem, ob die Anfrage erfolgreich war oder nicht.

Um das HTML Formular an die API zu übermitteln, benötigen wir die Funktion *addCategory*.
Sie bekommt die Formulardaten und erzeugt ein JSON Objekt für den Transfer an den Server.
Damit der neue Datensatz auch sichtbar wird, brauchen wir *revalidatePath*.
Sonst müsste der Benutzer händisch neu laden, um die Liste der Kategorien zu aktualisieren.


## Erstellen des Eingabeformulares für neue Kategorien

Um eine neue Kategorie zu erfassen, benötigen wir ein HTML Eingabeformular für die Felder *name*, *description*, *isValid* und *priority*.
Da *isValid* eim boolean Wert ist, wird eine Checkbox für die Darstellung verwendet.
Für die Darstellung der 3 Werte für Priority verwenden wir Radio Buttons.

**Quellcode: [src/app/categories/CategoryAdd.tsx](./Add_Form/src/app/categories/CategoryAdd.tsx)**

In diesem Beispiel ist die Verarbeitung von Formularen in Next.js gut dargestellt.
- Das *form* Element besitzt ein Attribut *onSubmit*.
  Es ruft die Funktion *handleSubmit* auf.
  Damit diese Funktion die Fehlermeldungen und Validierungen setzen kann, geben wir *setError* als Argument mit.
  Die *formRef* ist eine Referenz auf das Formular.
  Sie wird benötigt, um das Formular zu leeren, wenn der Request erfolgreich war.
- Die *input* Felder haben einen Namen, der über *formData.get()* in *addCategory* abgerufen werden kann.
- Wenn für das Formularfeld ein validation error vom Server zurückgegeben wird, zeigen wir diesen Fehler an entsprechender Stelle an.
  Der && operator erlaubt "bedingtes Anzeigen".
  Nur wenn der entsprechende Key gesetzt ist, wird das *span* Element mit der Fehlermeldung geschrieben.
- Damit wir für die einzelnen Priorities nicht händisch *name* und *id* vergeben müssen, verwenden wir ein Array und map.

Das CSS ist in **[src/app/categories/CategoryAdd.module.css](./Add_Form/src/app/categories/CategoryAdd.module.css)** zu finden.

## Anzeigen der Page mit Kategorieliste und Form

Wird nun die App mit der URL */categories* aufgerufen, lädt die *page.tsx* die Komponenten.
Wenn der Server einen Fehler liefert, wird eine Box mit der Fehlermeldung angezeigt.

**src/app/categories/CategoryList.tsx**

```tsx
import { Category } from "../types/Category";
import styles from "./CategoryList.module.css";

export default function CategoryList({categories}: {categories: Category[]}) {
    return (
        <div className={styles.categories}>
            <ul>
                {categories.map(item => (
                    <li
                        key={item.guid}
                    >
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

**src/app/categories/page.tsx**

```tsx
import CategoryList from "./CategoryList";
import CategoryAdd from "./CategoryAdd";
import { getCategories } from "./categoryApiClient";
import { isErrorResponse } from "../utils/apiClient";

export default async function CategoryPage() {
  const response = await getCategories();

  return (
    <div>
      <h1>Categories</h1>
      {!isErrorResponse(response) ? (
        <div>
          <CategoryList categories={response} />
          <h2>Add category</h2>
          <CategoryAdd />
        </div>
      )
        : <div className="errorbox">{response.message}</div>}

    </div>
  );
}
```

Die Errorbox ist global in **[src/app/globals.css](./Add_Form/src/app/globals.css)** definiert.

## Übung

Lade dir als Basis für die Implementierung die Datei [Add_Form20241212.zip](./Add_Form20241212.zip) und entpacke sie.
Vergiss nicht, `npm install` auszuführen, damit die Dependencies geladen werden.
Führe danach die folgende Ergänzung durch.

### API Test

Teste zuerst auf *https://localhost:5443/swagger/index.html* einen POST Request für */api/TodoItems* abzusetzen.
Folgende Daten im Request Body legen ein Todo Item in der Kategorie *Work* (GUID 00000000-0000-0000-0000-000000000001) an:

```json
{
  "title": "A new Item",
  "description": "Created now",
  "categoryGuid": "00000000-0000-0000-0000-000000000001",
  "dueDate": "2030-01-15"
}
```

Die API antwortet mit HTTP 201 Created und schickt die GUID des neuen Todo Items zurück.

Versuche nun, mit folgenden Daten erneut ein Todo Item mit dem selben Titel in der selben Kategorie anzulegen:

```json
{
  "title": "A new Item",
  "description": "Should throw an error.",
  "categoryGuid": "00000000-0000-0000-0000-000000000001",
  "dueDate": "2030-01-15"
}
```

Die API antwortet mit HTTP 400 Bad request und dem Text *SQLite Error 19: 'UNIQUE constraint failed: TodoItems.Title, TodoItems.CategoryId'.*.

Wenn ein Property ungültig ist, sendet die API ein error Object mit der Fehlerbeschreibung.

```json
{
  "title": "A new Item 2",
  "description": "Should throw an error.",
  "categoryGuid": "00000000-0000-0000-0000-000000000001",
  "dueDate": "2024-01-15"
}
```

führt zu folgender Antwort:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "DueDate": [
      "Due date must be in the future."
    ]
  },
  "traceId": "00-df1f4899e7fa6d389419729246fa00f6-bba39ef9800a7463-00"
}
```

### Implementierung mit Next.js

Erstelle eine Add Page für Todo Items unter *src/app/todos/add*.
Die Add Page soll folgende Formularfelder beinhalten:

- Ein Dropdown Menü mit allen Kategorien.
  Um das Menü aufzubauen, von der API vorher die Kategorien zu laden.
  Beim Anlegen des neuen Todo Items muss der gewählte GUID Wert der Kategorie im Feld `CategoryGuid` übertragen werden.
- Ein Textfeld für das Property `Title`.
  Der Titel ist erforderlich und muss zwischen 1 und 255 Stellen lang sein.
- Ein Textfeld für `Description`.
  Die Description ist erforderlich und muss zwischen 1 und 255 Stellen lang sein.
- Ein Feld vom Typ "date" für `DueDate`.
  Das *DueDate* ist optional.
  Wenn es angegeben wurde, dann muss es in der Zukunft liegen.
- Verlinke in der Page *src/app/todos/TodosClient.tsx* auf die Add Page.

Führe die Implementierung so durch:

- Erstelle eine Datei *src/app/todos/todosApiClient.ts*.
  Sie soll eine Methode `addTodoItem` beinhalten, die die Formulardaten an die API sendet.
- Erstelle eine Page in *src/app/todos/add/page.tsx*.
  Sie beinhaltet das Formular und ruft bei `onSubmit` die Methode `addTodoItem` auf.
- Verwende den API Client in *src/app/utils/apiClient.ts*.
  Er liefert dir im Fehlerfall ein Objekt vom Typ `ErrorResponse`.
  Ordne property bezogene Fehler den entsprechenden Formularfeldern zu.
  Allgemeine Fehler sollen mit *alert* ausgegeben werden.
  Teste auch, wie sich die Applikation verhält, wenn die API nicht erreichbar ist.

> [!IMPORTANT]
> Der API Client wandelt alle Keys für die Validierung in Kleinbuchstaben um.
> Die Validierung für das Feld `dueDate` ist unter `error.validations.duedate` abrufbar.



= Daten editieren und Komponentenkommunikation
:source-highlighter: rouge
:app-path: Edit_Form/src/app
ifndef::env-github[:icons: font]
ifdef::env-github[]
:caution-caption: :fire:
:important-caption: :exclamation:
:note-caption: :paperclip:
:tip-caption: :bulb:
:warning-caption: :warning:
endif::[]

image::./todo_edit_1328.png[]

[.lead]
_Link zum Programm: link:./Edit_Form20241216.zip[Edit_Form20241216.zip], im Repo unter 30_TodoApp/Edit_Form._


== Die Komponente `ModalDialog`

Oft benötigt man eine Komponente, die einen modalen Dialog anzeigt.
Er soll über der Seite angezeigt werden und nette Animationen besitzen.
Anstatt in jeder Page und Komponente den Dialog neu zu implementieren, ist es sinnvoll, eine eigene Komponente zu erstellen.

[source,jsx,linenums]
----
<ModalDialog 
    title="A nice title"
    onOk={() => doSomething()} onCancel={() => doSomething()}>
    <p>Some content</p>
</ModalDialog>
----

Der Dialog wird -- wie das Beispiel zeigt -- mit Parametern konfiguriert.
Die `onOk` und `onCancel` Funktionen werden aufgerufen, wenn der Benutzer auf den entsprechenden Button klickt.
Der Titel und der Inhalt des Dialogs werden ebenfalls übergeben.
Der Inhalt steht zwischen den Tags der Komponente.

Wie können wir nun auf diese Informationen zugreifen?
React gibt die Argumente der Komponente als Objekt an die Funktion weiter.
Um typsicher arbeiten zu können, definieren wir einen Type, der die Argumente beschreibt.
Die Funktionen haben den Typ `() => void`, da sie keine Argumente erwarten und keinen Wert zurückgeben.
Der Inhalt des Dialogs kann beliebig sein, daher verwenden wir den Typ `ReactNode` für `children`.

.src/app/components/ModalDialog.tsx
[source,jsx,linenums]
----
import { ReactNode } from "react";
import styles from "./ModalDialog.module.css";

type ModalDialogProps = {
  title: string;
  onOk?: () => void;
  onCancel?: () => void;
  children: ReactNode;
}

export default function ModalDialog({ title, onOk, onCancel, children }: ModalDialogProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{title}</h2>
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.okButton} onClick={onOk}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
----

=== Source files in der Edit Form App

⧉ link:{app-path}/components/ModalDialog.tsx[ModalDialog.tsx] +
⧉ link:{app-path}/components/ModalDialog.module.css[ModalDialog.module.css]

=== Verwendung der `ModalDialog` Komponente für das Edit Formular

Nachdem wir die `ModalDialog` Komponente erstellt haben, können wir sie in der `CategoryList` Komponente verwenden.
Wir wollen das Bearbeiten einer Kategorie in einem Dialog anzeigen.
Dafür geben wir eine neu zu schreibende Komponente `CategoryEdit` als Content der `ModalDialog` Komponente weiter.
Dies sieht dann so aus:

.src/app/categories/CategoryList.tsx
[source,jsx,linenums]
----
"use client";
// Some imports

export default function CategoryList({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoryEditRef = useRef<CategoryEditRef>(null);

  return (
    <div className={styles.categories}>
      <ul>
        {categories.map(category => (
          { /* ... */ }
              <span onClick={() => setSelectedCategory(category)}>
                ✏️
              </span>
          { /* ... */ }
        ))}
      </ul>

      {selectedCategory && (
        <ModalDialog
          title={`Edit ${selectedCategory.name}`}
          onOk={() => categoryEditRef.current?.startSubmit()}
          onCancel={() => setSelectedCategory(null)}>

            <CategoryEdit
              category={selectedCategory} ref={categoryEditRef}
              onSubmitted={() => setSelectedCategory(null)} />

        </ModalDialog>
      )}
    </div>
  );
}
----

Zuerst wird bei jeder Kategorie ein Edit-Icon angezeigt.
Beim Klicken wird mit dem State `selectedCategory` die ausgewählte Kategorie gespeichert.
Wenn eine Kategorie ausgewählt wurde, wird der Dialog angezeigt.
Die Anweisung `selectedCategory && ...` sorgt dafür, dass der Dialog nur angezeigt wird, wenn eine Kategorie ausgewählt wurde.
Die Handler `onCancel` setzt die ausgewählte Kategorie zurück und "schließt" den Dialog, indem `selectedCategpry` auf `null` gesetzt wird.
Die Komponente `CategoryEdit` besitzt auch ein Event: `onSubmitted`.
Dieses wird aufgerufen, wenn die Daten erfolgreich an die API gesendet wurden.

Der Handler für `onOk` liest sich etwas seltsam.
Wir haben nämlich ein Problem: In einem Formular gibt es üblicherweise einen Submit-Button, der das Formular abschickt.
Der OK Button wird allerdings im Dialog angezeigt, und nicht im Formular.
Wir müssen daher das Senden der Formulardaten über JavaScript auslösen.
Daher muss die Komponente `CategoryEdit` eine Methode `startSubmit` besitzen, die das Senden der Daten auslöst und die wir in der `CategoryList` Komponente aufrufen können.

=== Source files in der Edit Form App

⧉ link:{app-path}/categories/CategoryList.tsx[CategoryList.tsx] +
⧉ link:{app-path}/categories/CategoryList.module.css[CategoryList.module.css]

== Die Komponente `CategoryEdit`

=== Erweitern der API

In der Datei `categoryApiClient.ts` haben wir bereits Funktionen, die mit der API kommunizieren.
Hier fügen wir die Funktion `editCategory` hinzu, die den PUT-Request an die API sendet.
Der Aufbau ist wie bei den anderen Funktionen: Es wird ein `FormData` Objekt übergeben, das die Daten der Kategorie enthält.
Beachte, dass die GUID auch aus dem Formular extrahiert wird.
Es wird mit dem Typ `hidden` in einem `input` Element im Formular gespeichert.
Danach wird der PUT Request an `/api/categories/{guid}` gesendet.
Im Fehlerfall wird ein `ErrorResponse` Objekt zurückgegeben, damit das Formular - wie beim Hinzufügen von Katagorien - den Fehler anzeigen kann.

.src/app/categories/categoryApiClient.ts
[source,jsx,linenums]
----
export async function editCategory(formData: FormData): Promise<ErrorResponse | undefined> {
    // Extrahiere Daten aus dem Formular
    const guid = formData.get("guid");
    if (!guid) {
        return createErrorResponse(new Error("Invalid guid"));
    }
    const data = {
        guid: guid,
        name: formData.get("name"),
        description: formData.get("description"),
        isVisible: !!formData.get("isVisible"),     // converts null to false.
        priority: formData.get("priority"),
    };

    try {
        // Sende einen PUT-Request an die API
        await axiosInstance.put(`categories/${guid}`, data);
        revalidatePath("/categories");
    } catch (e) {
        return createErrorResponse(e);
    }
}
----

⧉ Source code: link:{app-path}/categories/categoryApiClient.ts[categoryApiClient.ts]

=== Erstellen der `CategoryEdit` Komponente

Die Komponente `CategoryEdit` ähnelt der `CategoryAdd` Komponente.
Im Formular müssen wir aber Werte vorbelegen, die bereits in der Kategorie gespeichert sind.
Dies geschieht mit `defaultValue` bzw. `defaultChecked` bei den `input` Elementen.
Wenn wir das Attribut `value` setzen, aber keinen `onChange`-Handler definieren, entsteht ein Fehler.
Daher brauchen wir diese speziellen Attribute, um die Werte zu setzen.

==== refs als Parameter

NOTE: Dieses Feature gibt es ab React 18.
In React 17 und darunter benötigt man die Funktion `forwardRef`, um Refs an Komponenten weiterzugeben.footnote:[https://react.dev/reference/react/forwardRef]

Damit wir in der parent Komponente `CategoryList` die Methode `startSubmit` aufrufen können, benötigen wir ein _ref_ auf die `CategoryEdit` Komponente.
Zusätzlich müssen wir die Methode `startSubmit` in der `CategoryEdit` Komponente implementieren und bereitstellen, welche die parent Komponente an geeigneter Stelle aufrufen kann.
Zuerst erstellen wir Typen für die Props und Refs:

[source,typescript,linenums]
----
export type CategoryEditRef = {
  startSubmit: () => void;
}

type CategoryEditProps = {
  category: Category;
  onSubmitted: () => void;
  ref?: React.Ref<CategoryEditRef>;
}

----

Der erste Typ ist wichtig, damit wir bei `useRef` in `CategoryList` den Typ angeben können.
Deswegen wird er auch mit `export` exportiert.
Der zweite Typ beschreibt die Props der Komponente.
Damit wir die Funktion `startSubmit` im ref zurückgeben können, benötigen wir die Funktion `useImperativeHandle`. Es erlaubt uns, eigene Funktionen des Refs zu definieren.footnote:[https://react.dev/reference/react/useImperativeHandle]

[source,typescript,linenums]
----
useImperativeHandle(ref, () => ({
  startSubmit: () => {
    formRef.current?.requestSubmit();
  },
}));
----

Unsere Komponente sieht nun so aus:

./src/app/categories/CategoryEdit.tsx
[source,jsx,linenums]
----
// Imports
export type CategoryEditRef = {
  startSubmit: () => void;
}

type CategoryEditProps = {
  category: Category;
  onSubmitted: () => void;
  ref?: React.Ref<CategoryEditRef>; // Ref as prop
}

async function handleSubmit(
  event: FormEvent,
  setError: Dispatch<SetStateAction<ErrorResponse>>,
  onSubmitted: () => void
) {
  event.preventDefault();
  const response = await editCategory(new FormData(event.target as HTMLFormElement));
  if (isErrorResponse(response)) {
    setError(response);
  } else {
    onSubmitted();
  }
}

export default function CategoryEdit(props: CategoryEditProps) {
  const { category, onSubmitted, ref } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());

  // UseImperativeHandle for custom methods exposed to the parent
  useImperativeHandle(ref, () => ({
    startSubmit: () => {
      formRef.current?.requestSubmit();
    },
  }));

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e, setError, onSubmitted)}
        ref={formRef}
        className={styles.categoryEdit}
      >
        <input type="hidden" name="guid" value={category.guid} />
        <div>
          <div>Name</div>
          <div>
            <input type="text" name="name" defaultValue={category.name} required />
          </div>
          <div>
            {error.validations.name && (
              <span className={styles.error}>{error.validations.name}</span>
            )}
          </div>
        </div>
        { /* ... */ }
      </form>
    </div>
  );
}

----

==== `CategoryEdit` Komponente ohne `useImperativeHandle`

NOTE: `useImperativeHandle` soll nur wenn nötig verwendet werden.
Es gibt auch Alternativen. So kann man z. B. die `formRef` in der parent Komponente erstellen und als Parameter übergeben. Dies bindet aber die Komponenten stärker aneinander.
Oft ist es auch ausreichend, den State als Parameter zu übergeben.
Dies nennt sich _lifting state up_ und ist ein gängiges Muster in React.
Mehr Informationen sind in der React Doku unter https://react.dev/learn/sharing-state-between-components[Sharing State Between Components] abrufbar.

Wenn wir eine `formRef` in der parent Komponente erstellen, können wir sie als Parameter übergeben.
Mit `formRef.current?.requestSubmit()` können wir das Formular abschicken.
Nachteil: Die parent Komponente muss wissen, dass die `CategoryEdit` Komponente ein Formular enthält.
Das ist eine stärkere Kopplung zwischen den Komponenten.

Konkret würde die Version ohne `useImperativeHandle` so aussehen:

.CategoryList.tsx (with form ref as parameter)
[source,jsx,linenums]
----
"use client";
export default function CategoryList({ categories }: { categories: Category[] }) {
  // Reference to the form element in CategoryEdit component
  const formRef = useRef<HTMLFormElement>(null); 
  return (
      { /* ... */ }
        <ModalDialog
          onOk={() => formRef.current?.requestSubmit()}>
          
          <CategoryEdit category={selectedCategory} 
            formRef={formRef}
            onSubmitted={() => setSelectedCategory(null)} />
        </ModalDialog>
  );
}
----

.CategoryEdit.tsx (without useImperativeHandle)
[source,jsx,linenums]
----
type CategoryEditProps = {
  category: Category;
  onSubmitted: () => void;
  formRef?: React.Ref<HTMLFormElement>;
}

export default function CategoryEdit(props: CategoryEditProps) {
  const { category, onSubmitted, formRef, ref } = props;
  // ...
    return (
      { /* ... */ }
      <form ref={formRef} onSubmit={handleSubmit}>
      { /* ... */ }
    )
}
----

=== Source files in der Edit Form App

⧉ link:{app-path}/categories/CategoryEdit.tsx[CategoryEdit.tsx] +
⧉ link:{app-path}/categories/CategoryEdit.module.css[CategoryEdit.module.css]


== Übung

Lade als Basis für deine Implementierung die Todo App von link:./Edit_Form20241216.zip[Edit_Form20241216.zip].
Auf der Seite Todos erscheint eine Liste aller Todos.
Diese sollen editiert werden können.
Gehe dabei so vor:

* Baue in der Component `src/app/todos/TodosClient.tsx` einen Link zum Editieren ein.
* Erstelle eine Component `src/app/todos/TodosEdit.tsx`, die in der Component _TodosClient_ bei Bedarf angezeigt wird.
* Das Editierformular soll in der vorhandenen Komponente `src/app/components/ModalDialog.tsx` angezeigt werden.
* Die folgenden Felder können editiert werden:
  ** Title (input type text)
  ** Description (input type text)
  ** CategoryGuid (Kategorien als Dropdownliste)
  ** IsCompleted (input type checkbox)
  ** DueDate (input type datetime-local)
* Gib Validierungsfehler der API aus. Todo Items können mittels PUT Request auf `/api/todoItems/(GUID)` aktualisiert werden.
* Prüfe mit Swagger auf _https://localhost:5443/swagger/index.html_, ob du folgendes TodoItem aktualisieren kannst:

.PUT /api/todoitems/3b33199e-bc34-7895-eb67-338383c35c99
[source,json]
----
  {
    "guid": "3b33199e-bc34-7895-eb67-338383c35c99",
    "title": "Editierter Titel ohne Duplikat",
    "description": "Editierte Beschreibung",
    "categoryGuid": "00000000-0000-0000-0000-000000000003",
    "isCompleted": true,
    "dueDate": "2024-12-28"
  }
----


= Daten löschen, reducer in React
:source-highlighter: rouge
:app-path: Edit_Form/src/app
ifndef::env-github[:icons: font]
ifdef::env-github[]
:caution-caption: :fire:
:important-caption: :exclamation:
:note-caption: :paperclip:
:tip-caption: :bulb:
:warning-caption: :warning:
endif::[]

image::todo_delete_1559.png[]

[.lead]
_Link zum Programm: link:./Delete20250316.zip[Delete20250316.zip], im Repo unter 30_TodoApp/Delete._

== Der DELETE Request in der API

Um Daten zu löschen, wird in der API ein DELETE Request verwendet.
Unser Backend stellt einen Endpunkt _DELETE /api/categories/{guid}_ zur Verfügung, um eine Kategorie zu löschen.
Er erwartet keine Parameter, da mit der GUID die Kategorie eindeutig identifiziert wird.
Als Antwort wird im Erfolgsfall HTTP 204 No Content zurückgegeben.
Hat eine Kategorie Todo Items, wird HTTP 400 Bad Request zurückgegeben.
Um den Endpunkt aufzurufen, erweitern wir zuerst die Datei _categoryApiClient_:

.src/app/categories/categoryApiClient.ts
[source,typescript]
----
export async function deleteCategory(guid: string): Promise<ErrorResponse | undefined> {
    try {
        await axiosInstance.delete(`categories/${guid}`);
        revalidatePath("/categories");
    } catch (e) {
        return createErrorResponse(e);
    }
}
----

== _useReducer()_ in React

Wir möchten nun einen Fehlerzustand in der Komponente _CategoryList_ einfügen.
Wenn ein User eine Kategorie editieren möchte, die nicht sichtbar ist (die Eigenschaft _isVisible_ ist _false_), so soll eine Fehlermeldung angezeigt werden.
Mit dem bisherigen Ansatz, nämlich der Verwendung von _useState_, müssen wir einiges beachten:

* Wir möchten auch einen Delete Button einfügen.
  Also brauchen wir einen State für die Kategorie, die gelöscht werden soll.
* Klickt ein User auf Delete, so darf natürlich keine Kategorie zum Editieren angewählt werden.
* Beim Klicken auf Edit muss die Sichtbarkeit der Kategorie vorher geprüft werden.
* Ist sie nicht sichtbar, wird mit _useState()_ der State _errorState_ gesetzt.

Wir sehen, dass bereits bei 3 möglichen Zuständen (_categoryToEditState_, _categoryToDeleteState_ und _errorState_) eine Menge an Logik brauchen, um die Applikation nicht in einen "unmöglichen" State zu bringen.
Das würde sich dadurch zeigen, dass z. B. der Editier- und der Löschdialog gleichzeitig geöffnet werden.

=== Modellierung des States als komplexen Type in Typescript

Der erste Schritt besteht darin, nicht 3 getrennte Variablen für den State zu deklarieren, sondern diesen State mit _einer_ Variable zu verwalten.
Natürlich ist diese Variante ein Object mit mehreren Properties.
Wir definieren folgenden Typ:

[source,typescript]
----
type CategoryListState =
  | { dialogType: "" }
  | { dialogType: "error"; error: string }
  | { dialogType: "edit" | "delete"; category: Category };
----

Dies zeigt eine sogenannte _discriminated union_ in Typescript.
Ein Discriminator ist ein Property, anhand dessen unterschieden wird.
Es ist in jeder einzelnen Variante vorhanden. 
Hier ist es das Property _dialogType_.

* Ist der _dialogType_ leer, so ist die Komponente im "Grundzustand".
  Es wird kein Dialog angezeigt.
* Wird der _dialogType_ auf _error_ gesetzt, so wird eine Fehlermeldung angezeigt.
* Wird der _dialogType_ auf _edit_ oder _delete_ gesetzt, brauchen wir auch eine betreffende Kategorie.

Durch diese Technik ist es durch das Typsystem von Typescript nicht möglich, unmögliche States zu setzen.

Wir können bereits diesen State mit _useState()_ direkt setzen und schon einige Vorteile daraus ziehen.

=== Der reducer als Funktion, die den Übergang steuert

Wir möchten jedoch auch prüfen, ob die Kategorie, die wir editieren möchten, auch sichtbar ist.
Mit _useState()_ wird der State direkt, also ohne Prüfung gesetzt.
Wenn wir Logik vor dem Setzen des neuen States einfügen möchten, gibt es in React die Funktion _useReducer()_.

.CategoryList.tsx
[source,tsx]
----
// Discriminated unions in typescript
type CategoryListState =
  | { dialogType: "" }
  | { dialogType: "error"; error: string }
  | { dialogType: "edit" | "delete"; category: Category };

type ReducerAction =
  | { resetState: true }
  | { resetState?: false; intent: "edit" | "delete"; category: Category };

function reducer(                                         // <2>
  state: CategoryListState,
  action: ReducerAction): CategoryListState {
  if (action.resetState) return { dialogType: "" }
  switch (action.intent ) {
    case "edit":
      if (action.category.isVisible)
        return { category: action.category, dialogType: "edit" };
      else
        return { dialogType: "error", error: "You cannot edit an invisible category." }
    case "delete":
      return { category: action.category, dialogType: "delete" };
    default:
      return { dialogType: "" };
  }
}

export default function CategoryList({ categories }: { categories: Category[] }) {
  const [state, dispatcher] = useReducer(reducer, { dialogType: "" });     // <1>
  /* .... */
  return (
    <span
    className={styles.editIcon}
    onClick={() => dispatcher({ intent: "edit", category: category })}     // <3>
    title="Edit">✏️</span>
  )
}
----

<1> _useReducer()_ liefert 2 Parameter zurück: Den _state_, den wir in unserer Komponente verwenden können und eine _dispatcher_ Funktion.
Diese Funktion wird verwendet, um den neuen State zu setzen.
<2> Die Funktion _reducer_ bekommt 2 Argumente: den alten State und die _action_.
Aufgrund der _action_ wird entschieden, wie der State gesetzt wird.
<3> Beim Klick auf den Edit Button wird nicht der neue State direkt gesetzt, sondern der Parameter _action_ der Funktion _dispatcher_ übergeben.
Sie entscheidet dann, welcher neue State gesetzt wird.

Grafisch lässt sich das Zusammenspiel wie folgt darstellen:

image::reducer_1347.svg[]


== Übung

Lade als Basis für deine Implementierung die Todo App von link:./Delete20250316.zip[Delete20250316.zip].
Auf der Seite Todos erscheint eine Liste aller Todos.
Diese sollen gelöscht werden können.
Gehe dabei so vor:

* Baue in der Component `src/app/todos/TodosClient.tsx` einen Link zum Löschen ein.
* Erstelle eine Component `src/app/todos/TodosDelete.tsx`, die in der Component _TodosClient_ bei Bedarf angezeigt wird.
* Zur Bestätigung wird die Komponente `ModalDialog` verwendet. Er wird direkt in der Komponente `TodosDelete` eingebunden.
* Die API bietet bei _DELETE /api/TodoItems/(guid)_ einen Query Parameter _deleteTasks_ an.
  Er gibt an, ob die verbundenen Tasks ebenfalls gelöscht werden sollen.
  Hat ein Todo Item Tasks und der Parameter _deleteTasks_ ist _false_ wird HTTP 400 Bad Request zurückgegeben.
  ** Beispiel (liefert HTTP 400): `DELETE https://localhost:5443/api/TodoItems/3b33199e-bc34-7895-eb67-338383c35c99?deleteTasks=false`
  ** Beispiel 2 (liefert no content): `DELETE https://localhost:5443/api/TodoItems/3b33199e-bc34-7895-eb67-338383c35c99?deleteTasks=true`
* Baue eine Checkbox in die Komponente `TodosDelete` ein, damit der User auswählen kann, ob auch die verbundenen Tasks gelöscht werden sollen.
* Wählt der User die Checkbox nicht aus, und das Löschen schlägt fehl, soll die Meldung in der Component `TodosClient.tsx` ausgegeben werden.
* Tipp: Du kannst einen _ref_ verwenden, um auf den Wert der Checkbox zuzugreifen.

Ein Screenshot des modalen Dialoges zum Löschen der Todo Items und die Fehlerausgabe in der Komponente _TodosClient_ könnte so aussehen:

image::delete_exercise_2234.png[]

NOTE: Du kannst den State für die Komponente _TodosClient_ wie folgt modellieren.
Ob du einen eigenen Reducer verwendest, bleibt dir überlassen.
Übergib den setter bzw. dispatcher an die Komponente _TodosDelete_.

[source,typescript]
----
type TodosClientState =
    | { action: "" }
    | { action: "error"; error: string }
    | { action: "delete"; todoItem: TodoItem };
----



= Globale States, _useContext()_ in React
:source-highlighter: rouge
:app-path: Edit_Form/src/app
ifndef::env-github[:icons: font]
ifdef::env-github[]
:caution-caption: :fire:
:important-caption: :exclamation:
:note-caption: :paperclip:
:tip-caption: :bulb:
:warning-caption: :warning:
endif::[]

image::todo_stateprovider_1659.png[]

[.lead]
_Link zum Programm: link:./State_Provider20250316.zip[State_Provider20250316.zip], im Repo unter 30_TodoApp/State_Provider._

Bis jetzt konnten wir mit _useState()_ und _useReducer()_ States für einzelne Komponenten definieren.
Wir haben mit *Lifting State Up* auch schon eine Technik kennengelernt, wo mehrere Komponenten auf einen State Zugriff haben können:

* Wir definieren den State mit _useState()_ in der _parent component_.
* Wir können den State oder die Set Funktion als _Parameter_ der child component übergeben.
  Dadurch konnte Komponente A den State setzen, und Komponente B zeigt den Inhalt an.

Dies funktioniert, wenn es eine parent component gibt.
Manchmal möchte man jedoch in jeder Komponente der Applikation Zugriff auf bestimmte Informationen haben.
So ist z. B. der angemeldete User oder der Inhalt des Warenkorbes für die gesamte Appkikation interessant.

== _useContext()_ in React

In React gibt es mit _useContext()_ einen vordefinierten Mechanismus für solche Anwendungsfälle.

____
useContext is a React Hook that lets you read and subscribe to context from your component.
____

Wir möchten für unsere Todo App ein zentrales Fehlermanagement und später den aktuell angemeldeten User anzeigen.
Dafür erstellen wir die Datei _src/app/context/TodoAppContext.tsx_

.src/app/context/TodoAppContext.tsx
[source,typescript]
----
import React, { createContext, useContext, useState, ReactNode } from 'react';

type TodoAppStateActions = {
    /**
     * Setzt die Fehlermeldung im globalen State.
     */
    setError: (value: string) => void;

    /**
     * Setzt den aktiven Benutzer im globalen State.
     */
    setActiveUser: (value: string) => void;
};

type TodoAppState = {
    /** Enthält eine mögliche Fehlermeldung. */
    error: string;

    /** Speichert den aktuellen aktiven Benutzer. */
    activeUser: string;
};

type TodoAppContextType = TodoAppState & { actions: TodoAppStateActions };

/** Erstellt einen Context für den globalen Todo-App-Status. */
const TodoAppContext = createContext<TodoAppContextType | undefined>(undefined);
----

Zuerst modellieren wir unseren globalen State als Typescript Type mit dem Namen _TodoAppState_.
Er beinhaltet die Properties _error_ und _activeUser_.
Da wir auch Funktionen bereitstellen möchten, die den State setzen, definieren wir einen type _TodoAppStateActions_.

Mit _createContext()_ bekommen wir ein _context object_, mit dem wir einen _context provider_ erstellen können.

== Der context provider

Der _context provider_ ist eine Komponente, die später in der Datei _layout.tsx_ verwendet wird.
Die Idee ist ähnlich wie bei _lifting state up_.
Wir bauen um alle Komponenten der Applikation eine Komponente "herum".
Deswegen wird _{children}_ verwendet, um die Applikation dort einzubetten.

.src/app/context/TodoAppContext.tsx
[source,tsx]
----
export function TodoAppStateProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TodoAppState>({ error: "", activeUser: "" });

    const setError = (value: string) => setState(prev => ({ ...prev, error: value }));
    const setActiveUser = (value: string) => setState(prev => ({ ...prev, activeUser: value }));

    return (
        <TodoAppContext.Provider value={{ ...state, actions: { setError, setActiveUser } }}>
            {children}
        </TodoAppContext.Provider>
    );
}
----

Beachte, dass wir nicht _export default_, sondern _export_ verwenden.
In der Funktion werden die einzelnen Actions wie _setError()_ und _setActiveUser()_ definiert.
Sie setzen einfach den State so, dass das Property _error_ bzw. _activeUser_ auf den übergebenen Wert gesetzt wird.

Die zurückgegebene Komponente _TodoAppContext.Provider_ hat als Parameter _value_ den gesamten State sowie die definierten Actions.
Natürlich müssen die Typen dem definierten Typ _TodoAppContextType_ entsprechen.

Nun brauchen wir noch eine Funktion _useTodoAppState()_, mit deren Hilfe wir in den einzelnen Komponenten Zugriff auf den globalen State haben.

.src/app/context/TodoAppContext.tsx
[source,tsx]
----
export function useTodoAppState() {
    const context = useContext(TodoAppContext);
    if (!context) {
        throw new Error('useTodoAppState must be used within a TodoAppStateProvider.');
    }
    return context;
}
----

Bachte auch hier, dass wir _export_ und nicht _export default_ verwenden.

== Einbindung in _layout.tsx_

Damit wir in allen Komponenten der App Zugriff auf den State haben, bearbeiten wir die Datei _layout.tsx_ so, dass wir den State Provider über allen Komponenten der Applikation einbauen:

.src/app/layout.tsx
[source,tsx]
----
import Navbar from "@/app/components/Navbar";
import './globals.css'; // Importiere die globale CSS-Datei
import { TodoAppStateProvider } from "./context/TodoAppContext";
import ErrorViewer from "./components/ErrorViewer";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>To-Do App</title>
            </head>
            <body>
                <TodoAppStateProvider>
                    <div className="container">
                        <Navbar />
                        <main className="content">{children}</main>
                        <ErrorViewer />
                    </div>
                </TodoAppStateProvider>
            </body>
        </html>
    );
}

----

== Lesen des States: Der ErrorViewer

Nun können wir in _src/app/components/ErrorViewer.tsx_ eine Komponente erzeugen, die einen Dialog einblendet, wenn das Property _error_ im State gesetzt wird.
Die Komponente nutzt dabei die Funktion _useTodoAppState()_, die über den entsprechenden Import eingebunden wird.

Mit _todoAppState.error_ kann der gesetzte Fehler ausgelesen werden.
Mit _todoAppState.actions.setError()_ kann der Fehler gesetzt werden.
Nach 5 Sekunden wird der Fehler automatisch ausgeblendet.

.src/app/components/ErrorViewer.tsx
[source,tsx]
----
"use client";

import { useState, useEffect } from "react";
import { useTodoAppState } from "../context/TodoAppContext";
import styles from "./ErrorViewer.module.css";

export default function ErrorViewer() {
    const todoAppState = useTodoAppState();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (todoAppState.error) {
            setVisible(true);

            // Fehlernachricht nach 5 Sekunden automatisch ausblenden
            const timer = setTimeout(() => {
                setVisible(false);
                todoAppState.actions.setError("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [todoAppState.error]);

    return (
        <footer className={`${styles.errorViewer} ${visible ? styles.show : styles.hide}`}>
            <div className={styles.errorContent}>
                <p>{todoAppState.error}</p>
                <button
                    type="button"
                    className={styles.errorButton}
                    onClick={() => {
                        setVisible(false);
                        todoAppState.actions.setError("")
                    }}
                >
                    OK
                </button>
            </div>
        </footer>
    );
}
----

🔗 link:State_Provider/src/app/components/ErrorViewer.module.css[zum CSS in src/app/components/ErrorViewer.module.css]

== Setzen des Fehlers

In der Komponente _CategoryList_ kommt es beim Editieren einer Kategorie, die nicht sichtbar ist, zu einem Fehler.
Diesen wollen wir in unserem zentralen _ErrorViewer_ anzeigen lassen.
Dies ist nun sehr einfach.
Statt eines Dialoges in der Komponente, der prüft, ob _state.dialogType_ auf _error_ gesetzt ist, wird nun der Fehler im zentralen State gesetzt.
Gleich danach setzen wir in unserer Komponente den Fehler wieder zurück, da wir das Quittieren des Fehlers nicht mehr in unserer Komponente passiert.

.src/app/categories/CategoryList.tsx
[source,typescript]
----
useEffect(() => {
if (state.dialogType == "error") {
    todoAppState.actions.setError(state.error);
    dispatcher({ resetState: true });   // OK button to remove the error is in another component.
}
}, [state.dialogType]);
----

== Übung

Lade als Basis für deine Implementierung die Todo App von link:./State_Provider20250316.zip[State_Provider20250316.zip].

Es soll beim Aufrufen der App ein Dialog eingeblendet werden, in dem der User seinen Namen eingeben kann.
Wenn der User seinen Namen eingibt, dann soll dieser Name in der Navbar erscheinen.
Verwende dafür die vorgefertigte Komponente _ModalDialog_ und gehe so vor:

* Erstelle in _components_ eine Komponente _NameInput_.
  Sie zeigt den Dialog an und bietet ein Textfeld für den Usernamen an.
* Baue diese Komponente direkt in die Datei _layout.tsx_ ein.
* Die Komponente soll natürlich nur angezeigt werden, wenn kein Username gespeichert ist.
* Klickt der User auf _Cancel_, so möchte er keinen Usernamen anzeigen.
* Verwende den State _activeUser_ im vordefinierten State Provider in _src/app/context/TodoAppContext.tsx_.
  Ändere wenn nötig die Datentypen, sodass erkannt wird, dass der Benutzer seinen Namen nicht eingeben möchte.
  Ein Vorschlag wäre, in diesem Fall einen Leerstring oder "Guest" zu speichern.
  Wurde der Benutzer noch nicht zur Eingabe aufgefordert, kann z. B. der Wert _null_ sein.
* Wurde ein User mit seinem Namen angemeldet, so soll in der Navbar auch ein Link zur Abmeldung angezeigt werden.
  Dieser Link soll einfach den aktuellen Usernamen löschen und dadurch die _NameInput_ Komponente anzeigen.
* Ist kein User angemeldet, so soll in der Komponente _categoryList_ kein Edit oder Delete Button angezeigt werden.









# Bsp mit todos und categories

## Folder 'categories'

CategoryAdd.modules.css
---
.categoryAdd {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 10px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;

}

.categoryAdd > div > div:first-child {
    font-weight: bold;
    align-self: center;
}

.categoryAdd > div > div:last-child {
    display: flex;
    align-items: center;
}

.categoryAdd input[type="text"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.categoryAdd input[type="checkbox"] {
    transform: scale(1.5);
}

.categoryAdd label {
    margin-right: 10px;
}

.categoryAdd input[type="radio"] {
    margin-left: 5px;
}

.categoryAdd button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.categoryAdd button:hover {
    background-color: #45a049;
}

.error {
    color: hsl(45, 100%, 60%);
    position: relative; /* Ermöglicht die Positionierung des Pseudo-Elements */
    padding-left: 20px; /* Platz für das Warnsymbol */
    font-size: 16px;
}

.error::before {
    content: "⚠️"; /* Warnsymbol */
    color: hsl(45, 100%, 60%); /* Gelbe Warnfarbe */
    font-size: 12px;
    position: absolute;
    left: 0; /* Links vom Text */
    top: 50%;
    transform: translateY(-50%); /* Vertikal zentrieren */
    animation: blink 1s infinite; /* Blinkende Animation */
}

/* Animation für das Blink-Blink */
@keyframes blink {
    0%, 100% {
        opacity: 1;
        transform: translateY(-50%) scale(1); /* Normal */
    }
    50% {
        opacity: 0.5;
        transform: translateY(-50%) scale(1.2); /* Vergrößert */
    }
}
---

CategoryAdd.tsx
---
"use client"

import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { addCategory } from "./categoryApiClient"
import styles from "./CategoryAdd.module.css"
import { Dispatch, FormEvent, RefObject, SetStateAction, useEffect, useRef, useState } from "react";


async function handleSubmit(event: FormEvent, setError: Dispatch<SetStateAction<ErrorResponse>>,
    formRef: RefObject<HTMLFormElement>) {
    event.preventDefault();
    const response = await addCategory(new FormData(event.target as HTMLFormElement));
    if (isErrorResponse(response))
        setError(response);
    else
        formRef.current?.reset();
}


export default function CategoryAdd() {
    // Für den Renderer brauchen wir ein leeres ErrorResponse object.
    // Sonst würde bei error.validations.name auf ein undefined Objekt zugegriffen werden.
    const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
    const formRef = useRef<HTMLFormElement>(null);
    // Sonst wird alert mehrfach angezeigt, wenn die Komponente mehrmals gerendert wird.
    useEffect(() => { 
        if (error.message) { alert(error.message);} 
    }, [error]);

    return (
        <div>
            <form onSubmit={e => handleSubmit(e, setError, formRef)} ref={formRef} className={styles.categoryAdd}>
                <div>
                    <div>Name</div>
                    <div><input type="text" name="name" required /></div>
                    <div>{error.validations.name && <span className={styles.error}>{error.validations.name}</span>}</div>
                </div>
                <div>
                    <div>Description</div>
                    <div><input type="text" name="description" required /></div>
                    <div>{error.validations.description && <span className={styles.error}>{error.validations.description}</span>}</div>
                </div>
                <div>
                    <div>Visible?</div>
                    <div><input type="checkbox" name="isVisible" /></div>
                    <div>{error.validations.isVisible && <span className={styles.error}>{error.validations.isVisible}</span>}</div>
                </div>
                <div>
                    <div>Priority</div>
                    <div>
                        {["Low", "Medium", "High"].map(p => {
                            const id = `priority_${p}`.toLowerCase();
                            return <label key={p} htmlFor={id}>{p}<input type="radio" id={id} name="priority" value={p} required /></label>
                        })}
                    </div>
                    <div>{error.validations.priority && <span className={styles.error}>{error.validations.priority}</span>}</div>
                </div>
                <div>
                    <div>&nbsp;</div>
                    <div><button type="submit">Submit</button></div>
                </div>
            </form>
        </div>
    )
}
---

categoryApiClient.ts
---
"use server";
import { ErrorResponse, axiosInstance, createErrorResponse } from "@/app/utils/apiClient";
import { revalidatePath } from "next/cache";
import { Category, isCategory } from "@/app/types/Category";
import exp from "constants";

export async function getCategories(): Promise<Category[] | ErrorResponse> {
    try {
        const categoriesResponse = await axiosInstance.get<Category[]>("categories");
        return categoriesResponse.data.filter(isCategory);
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function getCategory(guid: string): Promise<Category | ErrorResponse> {
    try {
        const categoryResponse = await axiosInstance.get<Category>(`categories/${guid}`);
        if (isCategory(categoryResponse.data)) {
            return categoryResponse.data;
        }
        return createErrorResponse(new Error("Invalid category data"));
    }
    catch (e) {
        return createErrorResponse(e);
    }
}

export async function addCategory(formData: FormData): Promise<ErrorResponse | undefined> {
    // Extrahiere Daten aus dem Formular
    const data = {
        name: formData.get("name"),
        description: formData.get("description"),
        isVisible: !!formData.get("isVisible"),     // converts null to false.
        priority: formData.get("priority"),
    };

    try {
        // Sende einen POST-Request an die API
        await axiosInstance.post("categories", data);
        revalidatePath("/categories");
    } catch (e) {
        return createErrorResponse(e);
    }
}

export async function editCategory(formData: FormData): Promise<ErrorResponse | undefined> {
    // Extrahiere Daten aus dem Formular
    const guid = formData.get("guid");
    if (!guid) {
        return createErrorResponse(new Error("Invalid guid"));
    }
    const data = {
        guid: guid,
        name: formData.get("name"),
        description: formData.get("description"),
        isVisible: !!formData.get("isVisible"),     // converts null to false.
        priority: formData.get("priority"),
    };

    try {
        // Sende einen PUT-Request an die API
        await axiosInstance.put(`categories/${guid}`, data);
        revalidatePath("/categories");
    } catch (e) {
        return createErrorResponse(e);
    }
}

export async function deleteCategory(guid: string): Promise<ErrorResponse | undefined> {
    try {
        await axiosInstance.delete(`categories/${guid}`);
        revalidatePath("/categories");
    } catch (e) {
        return createErrorResponse(e);
    }
}
---

CategoryDelete.tsx
---
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalDialog from "../components/ModalDialog";
import { Category } from "../types/Category";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "../utils/apiClient";
import { deleteCategory } from "./categoryApiClient";

type CategoryDeleteProps = {
    category: Category;
    onCancel: () => void;
    onDeleted: () => void;
}
async function handleSubmit(
    categoryGuid: string,
    setError: Dispatch<SetStateAction<ErrorResponse>>,
    onDeleted: () => void
) {
    const response = await deleteCategory(categoryGuid);
    if (isErrorResponse(response)) {
        setError(response);
    } else {
        onDeleted();
    }
}


export default function CategoryDelete({ category, onCancel, onDeleted }: CategoryDeleteProps) {
    const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());
    useEffect(() => {
        if (error.message) {
            alert(error.message);
        }
    }, [error]);
    return (
        <div>
            <ModalDialog
                title={`Delete Category ${category.name}`}
                onCancel={onCancel}
                onOk={() => handleSubmit(category.guid, setError, onDeleted)}>
                <p>Möchtest du die Kategorie {category.name} wirklich löschen?</p>
            </ModalDialog>
        </div>
    );

}
---

CategoryEdit.module.css
---
.categoryEdit {
    display: grid;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;

    --grid-layout-gap: 10px;
    --grid-column-count: 2;
    --grid-item--min-width: 30em;

    --gap-count: calc(var(--grid-column-count) - 1);
    --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
    --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));

    grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));
    gap: var(--grid-layout-gap);

}

.categoryEdit>div>div:first-child {
    font-weight: bold;
    align-self: center;
}

.categoryEdit>div>div:last-child {
    display: flex;
    align-items: center;
}

.categoryEdit input[type="text"],
.categoryEdit textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.categoryEdit input[type="checkbox"] {
    transform: scale(1.5);
}

.categoryEdit label {
    margin-right: 10px;
}

.categoryEdit input[type="radio"] {
    margin-left: 5px;
}

.error {
    color: hsl(45, 100%, 60%);
    position: relative;
    /* Ermöglicht die Positionierung des Pseudo-Elements */
    padding-left: 20px;
    /* Platz für das Warnsymbol */
    font-size: 16px;
}

.error::before {
    content: "⚠️";
    /* Warnsymbol */
    color: hsl(45, 100%, 60%);
    /* Gelbe Warnfarbe */
    font-size: 12px;
    position: absolute;
    left: 0;
    /* Links vom Text */
    top: 50%;
    transform: translateY(-50%);
    /* Vertikal zentrieren */
    animation: blink 1s infinite;
    /* Blinkende Animation */
}

/* Animation für das Blink-Blink */
@keyframes blink {

    0%,
    100% {
        opacity: 1;
        transform: translateY(-50%) scale(1);
        /* Normal */
    }

    50% {
        opacity: 0.5;
        transform: translateY(-50%) scale(1.2);
        /* Vergrößert */
    }
}
---

CategoryEdit.tsx
---
import React, { Dispatch, FormEvent, useEffect, useImperativeHandle, useRef, useState, SetStateAction } from "react";
import { createEmptyErrorResponse, ErrorResponse, isErrorResponse } from "@/app/utils/apiClient";
import { Category } from "@/app/types/Category";
import { editCategory } from "./categoryApiClient";
import styles from "./CategoryEdit.module.css";

export type CategoryEditRef = {
  startSubmit: () => void;
}

type CategoryEditProps = {
  category: Category;
  onSubmitted: () => void;
  ref?: React.Ref<CategoryEditRef>; // Ref as prop
}

async function handleSubmit(
  event: FormEvent,
  setError: Dispatch<SetStateAction<ErrorResponse>>,
  onSubmitted: () => void
) {
  event.preventDefault();
  const response = await editCategory(new FormData(event.target as HTMLFormElement));
  if (isErrorResponse(response)) {
    setError(response);
  } else {
    onSubmitted();
  }
}

export default function CategoryEdit(props: CategoryEditProps) {
  const { category, onSubmitted, ref } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<ErrorResponse>(createEmptyErrorResponse());

  // UseImperativeHandle for custom methods exposed to the parent
  useImperativeHandle(ref, () => ({
    startSubmit: () => {
      formRef.current?.requestSubmit();
    },
  }));

  useEffect(() => {
    if (error.message) {
      alert(error.message);
    }
  }, [error]);

  return (
    <div>
      <form
        onSubmit={(e) => handleSubmit(e, setError, onSubmitted)}
        ref={formRef}
        className={styles.categoryEdit}
      >
        <input type="hidden" name="guid" value={category.guid} />
        <div>
          <div>Name</div>
          <div>
            <input type="text" name="name" defaultValue={category.name} required />
          </div>
          <div>
            {error.validations.name && (
              <span className={styles.error}>{error.validations.name}</span>
            )}
          </div>
        </div>
        <div>
          <div>Description</div>
          <div>
            <textarea name="description" defaultValue={category.description} required />
          </div>
          <div>
            {error.validations.description && (
              <span className={styles.error}>{error.validations.description}</span>
            )}
          </div>
        </div>
        <div>
          <div>Visible?</div>
          <div>
            <input type="checkbox" name="isVisible" defaultChecked={category.isVisible} />
          </div>
          <div>
            {error.validations.isVisible && (
              <span className={styles.error}>{error.validations.isVisible}</span>
            )}
          </div>
        </div>
        <div>
          <div>Priority</div>
          <div>
            {["Low", "Medium", "High"].map((p) => {
              const id = `priority_${p}`.toLowerCase();
              return (
                <label key={p} htmlFor={id}>
                  {p}
                  <input
                    type="radio"
                    id={id}
                    name="priority"
                    value={p}
                    defaultChecked={category.priority === p}
                    required
                  />
                </label>
              );
            })}
          </div>
          <div>
            {error.validations.priority && (
              <span className={styles.error}>{error.validations.priority}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
---

CategoryList.modules.css
---
.categories ul {
    list-style-type: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    gap: 10px;
    margin: 0 auto;
  }
  
  .categories li {
    background-color: #fff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .categories li h2 {
    margin: 0;
    font-size: 20px;
    color: #0070f3;
  }
  
  .categories li p {
    margin: 5px 0;
    color: #666;
  }
  
   .categoryHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .editIcon {
    font-size: 14px;
    cursor: pointer;
    color: #0070f3;
    transition: transform 0.2s ease, color 0.2s ease;
  }
  
  .editIcon:hover {
    transform: scale(1.2);
    color: #005bb5;
  }
---

CategoryList.tsx
---
"use client";
import React, { useReducer, useRef } from "react";
import { Category } from "@/app/types/Category";
import ModalDialog from "@/app/components/ModalDialog";
import CategoryEdit, { CategoryEditRef } from "./CategoryEdit";
import styles from "./CategoryList.module.css";
import CategoryDelete from "./CategoryDelete";

// Discriminated unions in typescript
type ReducerAction =
  | { resetState: true }
  | { resetState?: false; intent: "edit" | "delete"; category: Category };
type CategoryListState =
  | { dialogType: "" }
  | { dialogType: "error"; error: string }
  | { dialogType: "edit" | "delete"; category: Category };

function reducer(
  state: CategoryListState,
  action: ReducerAction): CategoryListState {
  if (action.resetState) return { dialogType: "" }
  switch (action.intent ) {
    case "edit":
      if (action.category.isVisible)
        return { category: action.category, dialogType: "edit" };
      else
        return { dialogType: "error", error: "You cannot edit an invisible category." }
    case "delete":
      return { category: action.category, dialogType: "delete" };
    default:
      return { dialogType: "" };
  }
}
export default function CategoryList({ categories }: { categories: Category[] }) {
  const [state, dispatcher] = useReducer(reducer, { dialogType: "" });
  const categoryEditRef = useRef<CategoryEditRef>(null);
  return (
    <div className={styles.categories}>
      <ul>
        {categories.map(category => (
          <li key={category.guid}>
            <div className={styles.categoryHeader}>
              <h2>{category.name}</h2>
              <span
                className={styles.editIcon}
                onClick={() => dispatcher({ intent: "edit", category: category })}
                title="Edit"
              >
                ✏️
              </span>
              <span
                className={styles.editIcon}
                onClick={() => dispatcher({ intent: "delete", category: category })}
                title="Delete"
              >
                🗑️
              </span>
            </div>
            <p>{category.description}</p>
            <p>Visible: {category.isVisible ? "yes" : "no"}</p>
          </li>
        ))}
      </ul>

      {state.dialogType == "error" && (
        <ModalDialog title="Error"
          onOk={() => dispatcher({ resetState: true })}
          onCancel={() => dispatcher({ resetState: true })}>
          {state.error}
        </ModalDialog>

      )}
      {state.dialogType == "edit" && (
        <ModalDialog title={`Edit ${state.category.name}`}
          onOk={() => categoryEditRef.current?.startSubmit()}
          onCancel={() => dispatcher({ resetState: true })}>
          <CategoryEdit category={state.category}
            ref={categoryEditRef}
            onSubmitted={() => dispatcher({ resetState: true })} />
        </ModalDialog>
      )}
      {state.dialogType == "delete" && (
        <CategoryDelete category={state.category}
          onCancel={() => dispatcher({ resetState: true })}
          onDeleted={() => dispatcher({ resetState: true })} />
      )}
    </div>
  );
}
---

page.tsx
---
import CategoryList from "./CategoryList";
import CategoryAdd from "./CategoryAdd";
import { getCategories } from "./categoryApiClient";
import { isErrorResponse } from "../utils/apiClient";

export default async function CategoryPage() {
  const response = await getCategories();

  return (
    <div>
      <h1>Categories</h1>
      {!isErrorResponse(response) ? (
        <div>
          <CategoryList categories={response} />
          <h2>Add category</h2>
          <CategoryAdd />
        </div>
      )
        : <div className="errorbox">{response.message}</div>}

    </div>
  );
}
---

## Folder 'todos'

page.tsx
---
import https from "https";
import TodosClient from "./TodosClient";
import { isTodoItem } from "../types/TodoItem";
import { isCategory } from "../types/Category";
import { axiosInstance } from "../utils/apiClient";

export default async function TodosPage() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // Categories laden, um das Dropdown befüllen zu können.
  const categoriesResponse = await axiosInstance.get("categories", { httpsAgent: agent });
  const categories = categoriesResponse.data.filter(isCategory);

  // TodoItems laden, um die Items anzeigen zu können
  const todoItemsResponse = await axiosInstance.get("todoItems", { httpsAgent: agent });
  const todoItems = todoItemsResponse.data.filter(isTodoItem);


  return <TodosClient todoItems={todoItems} categories={categories} />;
}
---

style.module.css
---
  .categories select {
    display: block;
    margin: 20px auto;
    padding: 10px;
    font-size: 16px;
  }
  
  .categories ul {
    list-style-type: none;
    padding: 0;
  }
  
  .categories li {
    background-color: #fff;
    margin: 10px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .categories li h2 {
    margin: 0;
    font-size: 20px;
    color: #0070f3;
  }
  
  .categories li p {
    margin: 5px 0;
    color: #666;
  }
  
  .categories .overdue {
    border:2px solid red;
    background-color: hsl(0, 100%, 90%)
  }
---

TodosClient.tsx
---
'use client';

import { useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");

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
                    </li>
                ))}
            </ul>
        </div>
    );
}
---


## Folder 'types'

Category.ts
---
export interface Category {
    guid: string;
    name: string;
    description: string;
    isVisible: boolean;
    priority: string;
    ownerName: string;
  }
  
  export function isCategory(item: any): item is Category {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "name" in item &&
      "description" in item &&
      "isVisible" in item &&
      "priority" in item &&
      "ownerName" in item
    );
  }
---

TodoItem.ts
---
export interface TodoItem {
    guid: string;
    title: string;
    description: string;
    categoryGuid: string;
    categoryName: string;
    categoryPriority: string;
    categoryIsVisible: boolean;
    isCompleted: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export function isTodoItem(item: any): item is TodoItem {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "title" in item &&
      "description" in item &&
      "categoryGuid" in item &&
      "categoryName" in item &&
      "categoryPriority" in item &&
      "categoryIsVisible" in item &&
      "isCompleted" in item &&
      "dueDate" in item &&
      "createdAt" in item &&
      "updatedAt" in item
    );
  }
---




# Bsp auf Todos klicken und alle TodoTasks bekommen

Es gibt die Folder about, component, todos und types

## Folder types

Category.ts
---
export interface Category {
    guid: string;
    name: string;
    description: string;
    isVisible: boolean;
    priority: string;
    ownerName: string;
  }
  
  export function isCategory(item: any): item is Category {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "name" in item &&
      "description" in item &&
      "isVisible" in item &&
      "priority" in item &&
      "ownerName" in item
    );
  }
---

TodoItem.ts
---
export interface TodoItem {
    guid: string;
    title: string;
    description: string;
    categoryName: string;
    categoryPriority: string;
    categoryIsVisible: boolean;
    isCompleted: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export function isTodoItem(item: any): item is TodoItem {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "title" in item &&
      "description" in item &&
      "categoryName" in item &&
      "categoryPriority" in item &&
      "categoryIsVisible" in item &&
      "isCompleted" in item &&
      "dueDate" in item &&
      "createdAt" in item &&
      "updatedAt" in item
    );
  }
---

TodoItemDetail.ts
---
export interface TodoItemDetail {
    guid: string;
    title: string;
    description: string;
    categoryName: string;
    categoryPriority: string;
    isCompleted: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    todoTasks: TodoTask[]; // Das Array mit den Todo-Tasks
  }
  
  export interface TodoTask {
    guid: string;
    title: string;
    isCompleted: boolean;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // Typeguard für TodoItemDetail
  export function isTodoItemDetail(item: any): item is TodoItemDetail {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "title" in item &&
      "description" in item &&
      "categoryName" in item &&
      "categoryPriority" in item &&
      "isCompleted" in item &&
      "dueDate" in item &&
      "createdAt" in item &&
      "updatedAt" in item &&
      Array.isArray(item.todoTasks) && 
      item.todoTasks.every(isTodoTask) // Validierung der enthaltenen TodoTasks
      // Überprüft, ob `item.todoTasks` ein Array ist und validiert jedes Element im Array, indem es `isTodoTask` aufruft.
      // Dies stellt sicher, dass jedes `TodoTask`-Objekt im `todoTasks`-Array den richtigen Typ und die erforderlichen Eigenschaften hat.
    ); 
  }
  
  // Typeguard für TodoTask
  export function isTodoTask(item: any): item is TodoTask {
    return (
      typeof item === "object" &&
      "guid" in item &&
      "title" in item &&
      "isCompleted" in item &&
      "dueDate" in item &&
      "createdAt" in item &&
      "updatedAt" in item
    );
  }
---


## Folder todos

page.tsx
---
import axios from "axios";
import https from "https";
import TodosClient from "./TodosClient";
import { isTodoItem } from "../types/TodoItem";
import { isCategory } from "../types/Category";

export default async function TodosPage() {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  // Categories laden, um das Dropdown befüllen zu können.
  const categoriesResponse = await axios.get("https://localhost:5443/api/Categories", { httpsAgent: agent });
  const categories = categoriesResponse.data.filter(isCategory);

  // TodoItems laden, um die Items anzeigen zu können
  const todoItemsResponse = await axios.get("https://localhost:5443/api/TodoItems", { httpsAgent: agent });
  const todoItems = todoItemsResponse.data.filter(isTodoItem);


  return <TodosClient todoItems={todoItems} categories={categories} />;
}
---

TodosClient.tsx
---
'use client';

import { useState } from "react";
import { TodoItem } from "../types/TodoItem";
import { Category } from "../types/Category";
import styles from "./style.module.css";
import Link from "next/link";

type Props = {
    todoItems: TodoItem[];
    categories: Category[];
};

export default function TodosClient({ todoItems, categories }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>("");

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
                        <Link href={`/todos/${item.guid}`}>{item.title}</Link>
                        <p>{item.description}</p>
                        <p>Kategorie: {item.categoryName}</p>
                        <p>Fällig am: {new Date(item.dueDate).toLocaleDateString()}</p>
                        <p>Status: {item.isCompleted ? "Abgeschlossen" : "Ausstehend"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
---

## Folder todos[id]

page.tsx
---
import axios from "axios";
import https from "https";
import { isTodoItemDetail } from "../../types/TodoItemDetail";
import TodoTasksClient from "./TodoTasksClient";

// `generateStaticParams` wird verwendet, um die Parameter für die dynamische Seite zu generieren
// In diesem Fall wird eine Liste von TodoItem-GUIDs erstellt, die später für die Generierung von statischen Seiten verwendet wird.
export async function generateStaticParams() {
  const agent = new https.Agent({
    rejectUnauthorized: false, // Ignoriert SSL-Zertifikatsfehler (nur für Entwicklungszwecke)
  });

  try {
    // Holt alle TodoItems von der API
    const response = await axios.get("https://localhost:5443/api/TodoItems", { httpsAgent: agent });
    const todoItems = response.data;

    // Extrahiert die GUIDs der TodoItems und bereitet sie für die statische Generierung vor
    const params = todoItems.map((item: { guid: string }) => ({
      id: item.guid, // Verwendet die GUID als `id` für das dynamische Routing
    }));

    return params; // Gibt eine Liste von Parametern zurück, die für die dynamische Seite verwendet werden
  } catch (error) { 
    console.error("Fehler beim Laden der TodoItems:", error);
    return []; // Leeres Array zurückgeben, falls keine TodoItems geladen werden können
  }
}

// `TodoItemPage` ist die Page-Komponente für jedes einzelne TodoItem, die anhand der dynamischen ID geladen wird
export default async function TodoItemPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>; // Erwartet ein Promise mit den `id`-Parametern (die GUID des TodoItems)
}) {
  // Löse das Promise auf, um die `params` zu erhalten, bevor auf die ID zugegriffen wird
  const params = await paramsPromise;

  const agent = new https.Agent({
    rejectUnauthorized: false, // Ignoriert SSL-Zertifikatsfehler (nur für Entwicklungszwecke)
  });

  try {
    // Holt die Detailinformationen des TodoItems von der API anhand der GUID (`params.id`)
    const response = await axios.get(
      `https://localhost:5443/api/TodoItems/${params.id}`,
      { httpsAgent: agent }
    );

    const todoItemDetail = response.data;

    // Überprüfen, ob die erhaltenen Daten dem erwarteten `TodoItemDetail`-Typ entsprechen
    if (isTodoItemDetail(todoItemDetail)) {
      // Wenn die Daten validiert sind, gebe die `TodoTasksClient`-Komponente mit den TodoItem-Details weiter
      return <TodoTasksClient todoItem={todoItemDetail} />;
    } else {
      // Wenn die Validierung fehlschlägt, gib eine Fehlermeldung aus
      return <p>Ungültige Daten empfangen.</p>;
    }
  } catch (error) {
    // Fehlerbehandlung: Wenn etwas beim Abrufen der TodoItem-Daten schiefgeht
    console.error("Fehler beim Laden der Daten:", error);
    return <p>Fehler beim Laden der Daten.</p>; // Gibt eine generische Fehlermeldung zurück
  }
}
---

TodoTaskClient.tsx
---
'use client'; // Dies weist Next.js an, diesen Code im Client (statt auf dem Server) auszuführen, was bedeutet, dass die Komponente die Client-seitige React-Logik verwendet

import styles from './style.module.css'; // Importiere die CSS-Module für das Styling dieser Komponente
import { TodoItemDetail } from '../../types/TodoItemDetail'; // Importiere den Typ für TodoItemDetails aus den Typdefinitionen

// Typisierung der Props, die an die Komponente übergeben werden
type Props = {
  todoItem: TodoItemDetail; // Das `todoItem` ist das Objekt, das die Details zu einem TodoItem enthält, einschließlich der Tasks
};

export default function TodoTasksClient({ todoItem }: Props) {
  return (
    <div className={styles.tasksContainer}> 
      {/* Die äußere Container-Div erhält eine CSS-Klasse, um die Aufgaben darzustellen */}
      <h1>Tasks für: {todoItem.title}</h1> 

      <p>{todoItem.description}</p>

      <ul className={styles.tasksList}>
        {todoItem.todoTasks.map(task => (
          <li
            key={task.guid} // Setze die GUID als eindeutigen Schlüssel für jedes Listenelement
            className={ 
              new Date(task.dueDate) < new Date() 
                ? styles.overdue // Wenn das Fälligkeitsdatum in der Vergangenheit liegt und die Aufgabe noch nicht abgeschlossen ist, bekommt das Element die "overdue"-Stilklasse
                : styles.onTime // Ansonsten bekommt das Element die "onTime"-Stilklasse
            }
          >
            <h2>{task.title}</h2> 

            <p>Status: {task.isCompleted ? 'Abgeschlossen' : 'Ausstehend'}</p>

            <p>Fällig am: {new Date(task.dueDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
---
'use client';

import { useState } from "react";
import { Module } from "../types/Module";
import { Topic } from "../types/Topic";
import styles from "./style.module.css";

type Props = {
    modules: Module[];
    topics: Topic[];
};

export default function ModuleClient({ modules, topics }: Props) {
    const [selectedModuleGuid, setSelectedModuleGuid] = useState<string>("");

    const handleModuleClick = (moduleGuid: string) => {
        setSelectedModuleGuid(moduleGuid);
    };

    return (
        <div className={styles.categories}>
            <h1>Module</h1>
            <ul>
                {modules.map(module => (
                    <li key={module.guid}>
                        <button onClick={() => handleModuleClick(module.guid)}>
                            {module.name}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedModuleGuid && (
                <>
                    <h2>Topics zum Modul</h2>
                    <ul>
                        {topics
                            .filter(topic => topic.moduleGuid === selectedModuleGuid)
                            .map(topic => (
                                <li key={topic.guid}>
                                    <strong>{topic.name}</strong>
                                    {/* <p>{topic.description}</p> */}
                                </li>
                            ))}
                    </ul>
                </>
            )}
        </div>
    );
}

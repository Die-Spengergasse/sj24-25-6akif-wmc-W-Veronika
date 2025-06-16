'use client'  // Da wir usePathname vom Router verwenden.

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname(); // Aktuellen Pfad abrufen

    return (
        <nav className={styles.nav}>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>Home</Link>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>About</Link>
            <Link href="/modules" className={pathname.startsWith('/modules') ? styles.active : ''}>Module</Link>
            <Link href="/exam" className={pathname.startsWith('/exam') && !pathname.startsWith('/exam/meinepruefungen') ? styles.active : ''}>Prüfungssimulation</Link>
            <Link href="/exam/meinepruefungen" className={pathname.startsWith('/exam/meinepruefungen') ? styles.active : ''}>Meine Prüfungen</Link>
        </nav>
    );
}
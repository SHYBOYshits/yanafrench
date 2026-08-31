"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./AdminShell.module.css";

const navItems = [
  { label: "Overview", href: "/admin" },
  { label: "Lessons", href: "/admin/lessons" },
  { label: "Student Progress", href: "/admin/progress" },
  { label: "Content", href: "/admin/content" },
  { label: "Resources", href: "/admin/resources" },
  { label: "Messages", href: "/admin/messages" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link href="/admin" className={styles.brand}>le hub<span>.</span> <small>admin</small></Link>
        <Link href="/student-hub" className={styles.viewStudent}>View as student →</Link>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <nav aria-label="Admin navigation">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname?.startsWith(item.href) || (item.href === "/admin/lessons" && pathname?.startsWith("/admin/course"));
              return (
                <Link key={item.href} href={item.href} className={active ? styles.navActive : styles.navItem}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

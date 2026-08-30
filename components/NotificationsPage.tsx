"use client";

import { getNotifications, type NotificationType } from "@/lib/notificationData";
import { DashboardShell } from "./DashboardShell";
import styles from "./NotificationsPage.module.css";

const typeLabels: Record<NotificationType, string> = {
  lesson: "New lesson",
  video: "New video",
  document: "New document",
  assignment: "Assignment deadline",
  speaking: "Speaking results",
  test: "Test results",
  class: "Upcoming class",
  feedback: "New feedback",
};

export function NotificationsPage() {
  const items = getNotifications();

  return (
    <DashboardShell>
      <div className={styles.head}>
        <small>LE HUB</small>
        <h1>Notifications.</h1>
      </div>

      <div className={styles.list}>
        {items.map((n) => (
          <div key={n.id} className={n.read ? styles.item : `${styles.item} ${styles.itemUnread}`}>
            {!n.read && <span className={styles.unreadDot} aria-hidden="true" />}
            <div>
              <span className={styles.type}>{typeLabels[n.type].toUpperCase()}</span>
              <strong>{n.title}</strong>
              <small>{n.detail}</small>
            </div>
            <span className={styles.date}>{n.date}</span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

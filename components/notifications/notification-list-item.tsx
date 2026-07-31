"use client";

import type { NotificationItem } from "@/types/notifications";
import { Archive, Trash2 } from "lucide-react";
import Link from "next/link";
import { NotificationIcon } from "./notification-icon";

function formatWhen(iso: string) {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso));
}

export function NotificationListItem({ notification, onMarkRead, onArchive, onDelete }: { notification: NotificationItem; onMarkRead: (id: string) => void; onArchive: (id: string) => void; onDelete: (id: string) => void }) {
  const content = (
    <>
      <div className="notification-list-item__icon"><NotificationIcon category={notification.category} /></div>
      <div>
        <p>{notification.title}</p>
        {notification.body ? <span className="notification-list-item__body">{notification.body}</span> : null}
        <time>{formatWhen(notification.createdAt)}</time>
      </div>
    </>
  );

  return (
    <li className={`notification-list-item${notification.status === "unread" ? " notification-list-item--unread" : ""}`}>
      {notification.link ? (
        <Link href={notification.link} className="notification-list-item__link" onClick={() => onMarkRead(notification.id)}>{content}</Link>
      ) : (
        <button type="button" className="notification-list-item__link" onClick={() => onMarkRead(notification.id)}>{content}</button>
      )}
      <div className="notification-list-item__actions">
        {notification.status !== "archived" && <button type="button" className="icon-button icon-button--soft" aria-label="Archive" onClick={() => onArchive(notification.id)}><Archive size={15} aria-hidden="true" /></button>}
        <button type="button" className="icon-button icon-button--soft" aria-label="Delete" onClick={() => onDelete(notification.id)}><Trash2 size={15} aria-hidden="true" /></button>
      </div>
    </li>
  );
}

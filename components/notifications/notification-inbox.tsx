"use client";

import { useNotifications } from "@/hooks/use-notifications";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { categoryLabels, notificationCategories } from "@/types/notifications";
import { CheckCheck, Inbox } from "lucide-react";
import { NotificationListItem } from "./notification-list-item";

const statusTabs = [
  { value: "unread" as const, label: "Unread" },
  { value: "read" as const, label: "Read" },
  { value: "archived" as const, label: "Archived" },
  { value: "all" as const, label: "All" },
];

export function NotificationInbox() {
  const { userId } = useSupabaseUser();
  const { notifications, isLoading, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, markRead, archive, remove, markAll } = useNotifications(userId);

  return (
    <div className="notifications-page">
      <header className="family-header">
        <div><p>Pilu</p><h1>Inbox</h1><span>Everything Pilu has let you know.</span></div>
        <button type="button" className="icon-button" aria-label="Mark all as read" onClick={markAll}><CheckCheck size={22} aria-hidden="true" /></button>
      </header>

      <div className="report-type-tabs" role="tablist" aria-label="Filter by status">
        {statusTabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={statusFilter === tab.value} className={statusFilter === tab.value ? "report-type-tabs__button report-type-tabs__button--active" : "report-type-tabs__button"} onClick={() => setStatusFilter(tab.value)}>{tab.label}</button>
        ))}
      </div>

      <select className="notification-inbox__category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)} aria-label="Filter by category">
        <option value="all">All categories</option>
        {notificationCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
      </select>

      {isLoading ? (
        <div className="report-empty-state" aria-busy="true"><Inbox size={24} aria-hidden="true" /><h2>Loading…</h2></div>
      ) : notifications.length === 0 ? (
        <div className="report-empty-state"><Inbox size={24} aria-hidden="true" /><h2>Nothing here</h2><p>Notifications will appear as Pilu has something gentle to share.</p></div>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <NotificationListItem key={notification.id} notification={notification} onMarkRead={markRead} onArchive={archive} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}

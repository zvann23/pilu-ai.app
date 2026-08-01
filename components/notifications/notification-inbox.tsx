"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useNotifications } from "@/hooks/use-notifications";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { notificationCategories } from "@/types/notifications";
import { CheckCheck, Inbox } from "lucide-react";
import { NotificationListItem } from "./notification-list-item";

export function NotificationInbox() {
  const { t } = useLocale();
  const nd = t((d) => d.notifications);
  const statusTabs = [
    { value: "unread" as const, label: nd.inboxPage.statusTabs.unread },
    { value: "read" as const, label: nd.inboxPage.statusTabs.read },
    { value: "archived" as const, label: nd.inboxPage.statusTabs.archived },
    { value: "all" as const, label: nd.inboxPage.statusTabs.all },
  ];
  const { userId } = useSupabaseUser();
  const { notifications, isLoading, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, markRead, archive, remove, markAll } = useNotifications(userId);

  return (
    <div className="notifications-page">
      <header className="family-header">
        <div><p>{nd.eyebrow}</p><h1>{nd.inboxPage.title}</h1><span>{nd.inboxPage.subtitle}</span></div>
        <button type="button" className="icon-button" aria-label={nd.inboxPage.markAllAria} onClick={markAll}><CheckCheck size={22} aria-hidden="true" /></button>
      </header>

      <div className="report-type-tabs" role="tablist" aria-label={nd.inboxPage.filterByStatusAria}>
        {statusTabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={statusFilter === tab.value} className={statusFilter === tab.value ? "report-type-tabs__button report-type-tabs__button--active" : "report-type-tabs__button"} onClick={() => setStatusFilter(tab.value)}>{tab.label}</button>
        ))}
      </div>

      <select className="notification-inbox__category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as typeof categoryFilter)} aria-label={nd.inboxPage.filterByCategoryAria}>
        <option value="all">{nd.inboxPage.allCategories}</option>
        {notificationCategories.map((category) => <option key={category} value={category}>{nd.categoryLabels[category]}</option>)}
      </select>

      {isLoading ? (
        <div className="report-empty-state" aria-busy="true"><Inbox size={24} aria-hidden="true" /><h2>{nd.inboxPage.loading}</h2></div>
      ) : notifications.length === 0 ? (
        <div className="report-empty-state"><Inbox size={24} aria-hidden="true" /><h2>{nd.inboxPage.emptyTitle}</h2><p>{nd.inboxPage.emptyBody}</p></div>
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

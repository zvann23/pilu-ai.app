"use client";

import type { FamilyActivityEvent, FamilyMember } from "@/types/family";
import { useMemo, useState } from "react";

const kindLabels: Record<string, string> = {
  feeding: "Feeding", sleep: "Sleep", diaper: "Diaper", growth: "Growth", medicine: "Medicine", memory: "Memory", milestone: "Milestone",
  member_joined: "Member joined", member_left: "Member left", member_removed: "Member removed", role_changed: "Role changed", family_renamed: "Family renamed", ownership_transferred: "Ownership transferred",
};

/** Family-management events (from the SQL RPCs) already read as full sentences; personal-action events need the actor's name prefixed. */
const fullSentenceKinds = new Set(["member_joined", "member_left", "member_removed", "role_changed", "family_renamed", "ownership_transferred"]);

function formatEventTime(iso: string) {
  const date = new Date(iso);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date);
}

export function FamilyActivityFeed({ events, members, showFilters = false, limit }: { events: FamilyActivityEvent[]; members: FamilyMember[]; showFilters?: boolean; limit?: number }) {
  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const kinds = useMemo(() => Array.from(new Set(events.map((event) => event.kind))), [events]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (memberFilter !== "all" && event.actorId !== memberFilter) return false;
      if (kindFilter !== "all" && event.kind !== kindFilter) return false;
      if (dateFilter && event.createdAt.slice(0, 10) !== dateFilter) return false;
      return true;
    });
  }, [events, memberFilter, kindFilter, dateFilter]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="family-activity-feed">
      {showFilters && (
        <div className="family-activity-feed__filters">
          <select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)} aria-label="Filter by member">
            <option value="all">All members</option>
            {members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}
          </select>
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)} aria-label="Filter by activity type">
            <option value="all">All types</option>
            {kinds.map((kind) => <option key={kind} value={kind}>{kindLabels[kind] ?? kind}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label="Filter by date" />
        </div>
      )}

      {visible.length === 0 ? (
        <p className="family-activity-feed__empty">No activity yet.</p>
      ) : (
        <ul>
          {visible.map((event) => (
            <li key={event.id}>
              <span className="family-activity-feed__dot" aria-hidden="true" />
              <div>
                <p>{fullSentenceKinds.has(event.kind) ? event.title : `${event.actorName} ${event.title}`}</p>
                <time>{formatEventTime(event.createdAt)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

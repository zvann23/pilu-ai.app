"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { FamilyDict } from "@/lib/i18n/dictionary/family";
import { intlLocaleTags, type Locale } from "@/lib/i18n/locales";
import type { ActivityEventKind, FamilyActivityEvent, FamilyMember } from "@/types/family";
import { useMemo, useState } from "react";

/** Family-management events (from the SQL RPCs) already read as full sentences; personal-action events need the actor's name prefixed. */
const fullSentenceKinds = new Set(["member_joined", "member_left", "member_removed", "role_changed", "family_renamed", "ownership_transferred"]);

function formatEventTime(iso: string, fd: FamilyDict["activityFeed"], locale: Locale) {
  const date = new Date(iso);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60_000));
  if (diffMinutes < 1) return fd.justNow;
  if (diffMinutes < 60) return fd.minutesAgoTemplate.replace("{m}", String(diffMinutes));
  if (diffMinutes < 1440) return fd.hoursAgoTemplate.replace("{h}", String(Math.round(diffMinutes / 60)));
  return new Intl.DateTimeFormat(intlLocaleTags[locale], { day: "numeric", month: "short" }).format(date);
}

export function FamilyActivityFeed({ events, members, showFilters = false, limit }: { events: FamilyActivityEvent[]; members: FamilyMember[]; showFilters?: boolean; limit?: number }) {
  const { t, locale } = useLocale();
  const fd = t((d) => d.family.activityFeed);

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
          <select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)} aria-label={fd.filterByMember}>
            <option value="all">{fd.allMembers}</option>
            {members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}
          </select>
          <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)} aria-label={fd.filterByType}>
            <option value="all">{fd.allTypes}</option>
            {kinds.map((kind) => <option key={kind} value={kind}>{fd.kindLabels[kind as ActivityEventKind] ?? kind}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} aria-label={fd.filterByDate} />
        </div>
      )}

      {visible.length === 0 ? (
        <p className="family-activity-feed__empty">{fd.noActivityYet}</p>
      ) : (
        <ul>
          {visible.map((event) => (
            <li key={event.id}>
              <span className="family-activity-feed__dot" aria-hidden="true" />
              <div>
                <p>{fullSentenceKinds.has(event.kind) ? event.title : `${event.actorName} ${event.title}`}</p>
                <time>{formatEventTime(event.createdAt, fd, locale)}</time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

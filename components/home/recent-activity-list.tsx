"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { recentActivities } from "@/lib/home-data";
import Link from "next/link";

export function RecentActivityList() {
  const { t } = useLocale();
  const activityDict = t((d) => d.activity);
  const homeDict = t((d) => d.home.recentActivity);

  return (
    <section className="home-section recent-activity" aria-labelledby="recent-activity-title">
      <div className="home-section__heading home-section__heading--row"><div><h2 id="recent-activity-title">{homeDict.heading}</h2><p>{homeDict.subheading}</p></div><Link href="/timeline">{homeDict.button}</Link></div>
      <div className="recent-activity__list">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          const detail = activity.id === "diaper" ? activityDict.diaperWet : activity.detail;
          const time = activityDict.agoTemplate.replace("{duration}", activity.time);
          return <article key={activity.id} className="recent-activity__item"><div className={`recent-activity__icon recent-activity__icon--${activity.tone}`}><Icon size={18} aria-hidden="true" /></div><div><h3>{activityDict.kinds[activity.id]}</h3><p>{detail}</p></div><time>{time}</time></article>;
        })}
      </div>
    </section>
  );
}

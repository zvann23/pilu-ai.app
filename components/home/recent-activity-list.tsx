import { recentActivities } from "@/lib/home-data";
import Link from "next/link";

export function RecentActivityList() {
  return (
    <section className="home-section recent-activity" aria-labelledby="recent-activity-title">
      <div className="home-section__heading home-section__heading--row"><div><h2 id="recent-activity-title">Recent activity</h2><p>A little look at today</p></div><Link href="/timeline">View timeline</Link></div>
      <div className="recent-activity__list">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return <article key={activity.label} className="recent-activity__item"><div className={`recent-activity__icon recent-activity__icon--${activity.tone}`}><Icon size={18} aria-hidden="true" /></div><div><h3>{activity.label}</h3><p>{activity.detail}</p></div><time>{activity.time}</time></article>;
        })}
      </div>
    </section>
  );
}

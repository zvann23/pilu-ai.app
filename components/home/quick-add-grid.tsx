"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { quickAddActions } from "@/lib/home-data";

export function QuickAddGrid({ onOpen }: { onOpen: () => void }) {
  const { t } = useLocale();
  const activityKinds = t((d) => d.activity.kinds);
  const quickAddDict = t((d) => d.home.quickAdd);

  return (
    <section className="home-section" aria-labelledby="quick-add-title">
      <div className="home-section__heading"><h2 id="quick-add-title">{quickAddDict.heading}</h2><p>{quickAddDict.subheading}</p></div>
      <div className="quick-add-grid">
        {quickAddActions.map((action) => {
          const Icon = action.icon;
          return <button key={action.id} className="quick-add-action" type="button" onClick={onOpen}><Icon size={20} aria-hidden="true" /><span>{activityKinds[action.id]}</span></button>;
        })}
      </div>
    </section>
  );
}

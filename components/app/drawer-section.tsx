"use client";

import { DrawerItem } from "@/components/app/drawer-item";
import { useLocale } from "@/components/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { NavigationSection } from "@/lib/navigation";

export function DrawerSection({ section, onNavigate }: { section: NavigationSection; onNavigate: () => void }) {
  const { t } = useLocale();
  const title = t((d) => d.nav.sections[section.id as keyof Dictionary["nav"]["sections"]]);

  return (
    <section className="drawer-section" aria-labelledby={`drawer-section-${section.id}`}>
      <h2 id={`drawer-section-${section.id}`}>{title}</h2>
      <ul>
        {section.items.map((item) => <li key={item.slug}><DrawerItem item={item} onNavigate={onNavigate} /></li>)}
      </ul>
    </section>
  );
}

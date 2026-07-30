import { DrawerItem } from "@/components/app/drawer-item";
import type { NavigationSection } from "@/lib/navigation";

export function DrawerSection({ section, onNavigate }: { section: NavigationSection; onNavigate: () => void }) {
  return (
    <section className="drawer-section" aria-labelledby={`drawer-section-${section.title}`}>
      <h2 id={`drawer-section-${section.title}`}>{section.title}</h2>
      <ul>
        {section.items.map((item) => <li key={item.slug}><DrawerItem item={item} onNavigate={onNavigate} /></li>)}
      </ul>
    </section>
  );
}

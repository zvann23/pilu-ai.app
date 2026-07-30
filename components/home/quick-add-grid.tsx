import { quickAddActions } from "@/lib/home-data";

export function QuickAddGrid({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="home-section" aria-labelledby="quick-add-title">
      <div className="home-section__heading"><h2 id="quick-add-title">Quick add</h2><p>Log a recent activity</p></div>
      <div className="quick-add-grid">
        {quickAddActions.map((action) => {
          const Icon = action.icon;
          return <button key={action.label} className="quick-add-action" type="button" onClick={onOpen}><Icon size={20} aria-hidden="true" /><span>{action.label}</span></button>;
        })}
      </div>
    </section>
  );
}

import { Sparkles } from "lucide-react";

export function InsightCard() {
  return (
    <section className="insight-card">
      <div className="insight-card__heading"><Sparkles size={18} aria-hidden="true" /><h2>Today&apos;s insight</h2></div>
      <p>Emma had a good night. She slept 6h 45m with 2 wake-ups and is feeding well.</p>
      <span>Based on today&apos;s mock activity.</span>
    </section>
  );
}

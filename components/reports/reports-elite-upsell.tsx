import { Sparkles } from "lucide-react";
import Link from "next/link";

const previewHighlights = ["3 feedings, right on your usual rhythm", "A calm 6h 45m of sleep overnight", "A big smile after breakfast — noted for the memory book"];

/** Free-tier preview: a realistic but sample section, faded under an upgrade CTA. */
export function ReportsEliteUpsell() {
  return (
    <div className="reports-elite">
      <div className="reports-elite__preview" aria-hidden="true">
        <section className="report-section">
          <header>
            <Sparkles size={17} />
            <div>
              <p>Snapshot</p>
              <h3>Today&apos;s Highlights</h3>
            </div>
          </header>
          <ul className="report-view__list">
            {previewHighlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <div className="reports-elite__fade" />
      </div>

      <div className="reports-elite__cta">
        <h2>AI Reports is a Pilu Elite feature</h2>
        <p>Unlock calm, unlimited Daily, Weekly, and Monthly summaries — with charts, routines noticed, and gentle questions to bring to your pediatrician.</p>
        <Link href="/subscription">Upgrade to Elite</Link>
      </div>
    </div>
  );
}

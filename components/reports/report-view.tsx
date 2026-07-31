import type { GeneratedReport } from "@/types/reports";
import { CalendarDays, HeartPulse, MessageCircleQuestion, Milk, Moon, Scale, Sparkles, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { ReportActions } from "./report-actions";
import { ReportBarChart } from "./report-bar-chart";
import { ReportLineChart } from "./report-line-chart";

export function ReportView({ report, isGenerating, onRegenerate, onToast }: { report: GeneratedReport; isGenerating: boolean; onRegenerate: () => void; onToast: (message: string) => void }) {
  const { content, charts } = report;

  return (
    <article className="report-view">
      <header className="report-view__header">
        <div>
          <p><CalendarDays size={14} aria-hidden="true" /> {report.periodLabel}</p>
          <h2>{report.babyName}&apos;s {report.type} report</h2>
        </div>
      </header>

      <p className="report-view__overview">{content.overview}</p>

      {content.todaysHighlights.length > 0 && (
        <ReportSection icon={Sun} eyebrow="Snapshot" title="Today's Highlights">
          <ul className="report-view__list">
            {content.todaysHighlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </ReportSection>
      )}

      <ReportSection icon={Sparkles} eyebrow="Patterns" title="Routine Trends">
        <p>{content.routineTrends}</p>
      </ReportSection>

      <ReportSection icon={Moon} eyebrow="Rest" title="Sleep Summary">
        <p>{content.sleepSummary}</p>
        <ReportBarChart chart={charts.sleep} eyebrow="Sleep" />
      </ReportSection>

      <ReportSection icon={Milk} eyebrow="Nourishment" title="Feeding Summary">
        <p>{content.feedingSummary}</p>
        <ReportBarChart chart={charts.feeding} eyebrow="Feeding" />
      </ReportSection>

      <ReportSection icon={Scale} eyebrow="Growing" title="Growth Progress">
        <p>{content.growthProgress}</p>
        <ReportLineChart chart={charts.growth} />
      </ReportSection>

      <ReportSection icon={Sparkles} eyebrow="Achievements" title="Milestones">
        <p>{content.milestones}</p>
      </ReportSection>

      <ReportSection icon={HeartPulse} eyebrow="Joy" title="Happy Moments">
        <p>{content.happyMoments}</p>
      </ReportSection>

      {content.suggestionsForParents.length > 0 && (
        <ReportSection icon={Sparkles} eyebrow="Gentle ideas" title="Suggestions for Parents">
          <ul className="report-view__list">
            {content.suggestionsForParents.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </ReportSection>
      )}

      {content.pediatricianQuestions.length > 0 && (
        <ReportSection icon={MessageCircleQuestion} eyebrow="For your next visit" title="Questions to Ask Your Pediatrician">
          <ul className="report-view__list">
            {content.pediatricianQuestions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </ReportSection>
      )}

      <p className="reports-disclaimer">{content.disclaimer} Pilu never diagnoses conditions or recommends medication — always talk to your pediatrician about any health concerns.</p>

      <ReportActions report={report} isGenerating={isGenerating} onRegenerate={onRegenerate} onToast={onToast} />
    </article>
  );
}

function ReportSection({ icon: Icon, eyebrow, title, children }: { icon: typeof Sun; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="report-section">
      <header>
        <Icon size={17} aria-hidden="true" />
        <div>
          <p>{eyebrow}</p>
          <h3>{title}</h3>
        </div>
      </header>
      {children}
    </section>
  );
}

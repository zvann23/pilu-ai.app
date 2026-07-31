import { reportTypeDescriptions } from "@/lib/reports-data";
import type { ReportType } from "@/types/reports";
import { Sparkles } from "lucide-react";

export function ReportEmptyState({ type, isGenerating, onGenerate }: { type: ReportType; isGenerating: boolean; onGenerate: () => void }) {
  return (
    <div className="report-empty-state">
      <Sparkles size={26} aria-hidden="true" />
      <h2>No {type} report yet</h2>
      <p>{reportTypeDescriptions[type]} Pilu will read through feeding, sleep, growth, milestones, and memories to write a calm summary.</p>
      <button type="button" className="button button--primary" onClick={onGenerate} disabled={isGenerating}>
        {isGenerating ? "Generating…" : "Generate report"}
      </button>
    </div>
  );
}

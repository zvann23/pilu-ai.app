"use client";

import type { GeneratedReport } from "@/types/reports";
import { Download, RefreshCw, Share2 } from "lucide-react";

function shareText(report: GeneratedReport) {
  const lines = [
    `${report.babyName}'s ${report.periodLabel} Pilu report`,
    "",
    report.content.overview,
    "",
    "Today's Highlights",
    ...report.content.todaysHighlights.map((item) => `• ${item}`),
  ];
  return lines.join("\n");
}

export function ReportActions({ report, isGenerating, onRegenerate, onToast }: { report: GeneratedReport; isGenerating: boolean; onRegenerate: () => void; onToast: (message: string) => void }) {
  async function share() {
    const text = shareText(report);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Pilu report", text });
        return;
      } catch {
        return;
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      onToast("Report copied to clipboard");
    }
  }

  return (
    <div className="report-actions">
      <button type="button" className="button button--secondary" onClick={onRegenerate} disabled={isGenerating}>
        <RefreshCw size={16} aria-hidden="true" />
        {isGenerating ? "Regenerating…" : "Regenerate"}
      </button>
      <button type="button" className="button button--secondary" onClick={share}>
        <Share2 size={16} aria-hidden="true" />
        Share
      </button>
      <button type="button" className="button button--secondary" onClick={() => onToast("PDF export is coming soon")}>
        <Download size={16} aria-hidden="true" />
        Export PDF
      </button>
    </div>
  );
}

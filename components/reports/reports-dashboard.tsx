"use client";

import { Toast } from "@/components/timeline/toast";
import { useEliteAccess } from "@/hooks/use-elite-access";
import { useReports } from "@/hooks/use-reports";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import type { ReportType } from "@/types/reports";
import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ReportEmptyState } from "./report-empty-state";
import { ReportTypeTabs } from "./report-type-tabs";
import { ReportView } from "./report-view";
import { ReportsEliteUpsell } from "./reports-elite-upsell";

export function ReportsDashboard() {
  const { userId, isLoading: isUserLoading } = useSupabaseUser();
  const { isElite, isLoading: isEliteLoading } = useEliteAccess(userId);
  const { reports, isLoadingHistory, isGenerating, error, generate, babyName } = useReports(userId);
  const [selectedType, setSelectedType] = useState<ReportType>("daily");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function showToast(message: string) {
    setToast(message);
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3200);
  }

  if (isUserLoading || isEliteLoading) {
    return <div className="reports-page" aria-busy="true" />;
  }

  if (!isElite) {
    return (
      <div className="reports-page">
        <ReportsHeader babyName={babyName} />
        <ReportsEliteUpsell />
      </div>
    );
  }

  const currentReport = reports.find((report) => report.type === selectedType);

  return (
    <div className="reports-page">
      <ReportsHeader babyName={babyName} />
      <ReportTypeTabs active={selectedType} onChange={setSelectedType} />

      {isLoadingHistory ? (
        <div className="report-empty-state" aria-busy="true">
          <Sparkles size={26} aria-hidden="true" />
          <h2>Loading reports…</h2>
        </div>
      ) : currentReport ? (
        <ReportView report={currentReport} isGenerating={isGenerating} onRegenerate={() => generate(selectedType)} onToast={showToast} />
      ) : (
        <ReportEmptyState type={selectedType} isGenerating={isGenerating} onGenerate={() => generate(selectedType)} />
      )}

      {error ? <p className="report-view__error">{error}</p> : null}

      <Toast message={toast} />
    </div>
  );
}

function ReportsHeader({ babyName }: { babyName: string }) {
  return (
    <header className="reports-header">
      <div>
        <p>Pilu Elite</p>
        <h1>AI Reports</h1>
        <span>Calm, honest summaries of {babyName}&apos;s recent days.</span>
      </div>
      <Sparkles size={29} aria-hidden="true" />
    </header>
  );
}

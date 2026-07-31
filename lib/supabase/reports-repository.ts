import { supabase } from "@/lib/supabase/client";
import type { GeneratedReport, ReportType } from "@/types/reports";

type ReportRow = {
  id: string;
  report_type: ReportType;
  period_start: string;
  period_end: string;
  title: string;
  content: unknown;
  created_at: string;
};

function rowToReport(row: ReportRow): GeneratedReport {
  const content = row.content as GeneratedReport["content"];
  const charts = (row.content as { __charts?: GeneratedReport["charts"] } & GeneratedReport["content"]).__charts;
  return {
    id: row.id,
    type: row.report_type,
    babyName: row.title.split(" — ")[0] ?? "",
    periodStart: row.period_start,
    periodEnd: row.period_end,
    periodLabel: row.title.split(" — ")[1] ?? "",
    generatedAt: row.created_at,
    content,
    charts: charts as GeneratedReport["charts"],
  };
}

export async function saveReport(userId: string, report: Omit<GeneratedReport, "id">): Promise<GeneratedReport> {
  const { data, error } = await supabase
    .from("ai_reports")
    .insert({
      user_id: userId,
      report_type: report.type,
      period_start: report.periodStart,
      period_end: report.periodEnd,
      title: `${report.babyName} — ${report.periodLabel}`,
      content: { ...report.content, __charts: report.charts },
    })
    .select("id, report_type, period_start, period_end, title, content, created_at")
    .single();

  if (error) throw error;
  return rowToReport(data as ReportRow);
}

export async function listReports(userId: string, limit = 10): Promise<GeneratedReport[]> {
  const { data, error } = await supabase
    .from("ai_reports")
    .select("id, report_type, period_start, period_end, title, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as ReportRow[] ?? []).map(rowToReport);
}

export async function getLatestReport(userId: string): Promise<GeneratedReport | null> {
  const { data, error } = await supabase
    .from("ai_reports")
    .select("id, report_type, period_start, period_end, title, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToReport(data as ReportRow) : null;
}

export async function deleteReport(userId: string, reportId: string): Promise<void> {
  const { error } = await supabase.from("ai_reports").delete().eq("user_id", userId).eq("id", reportId);
  if (error) throw error;
}

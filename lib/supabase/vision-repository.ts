import { supabase } from "@/lib/supabase/client";
import type { VisionCategory, VisionScan } from "@/types/vision";

type ScanRow = {
  id: string;
  baby_id: string;
  category: VisionCategory;
  title: string;
  summary: string;
  key_points: string[];
  concerns: string[];
  recommendation: string;
  is_saved: boolean;
  created_at: string;
};

const scanColumns = "id, baby_id, category, title, summary, key_points, concerns, recommendation, is_saved, created_at";

function rowToScan(row: ScanRow): VisionScan {
  return {
    id: row.id,
    babyId: row.baby_id,
    category: row.category,
    title: row.title,
    summary: row.summary,
    keyPoints: row.key_points ?? [],
    concerns: row.concerns ?? [],
    recommendation: row.recommendation,
    disclaimer: "Pilu Vision provides general information, not medical diagnosis — contact a healthcare professional for anything you're concerned about.",
    isSaved: row.is_saved,
    createdAt: row.created_at,
  };
}

export async function listScans(babyId: string): Promise<VisionScan[]> {
  const { data, error } = await supabase
    .from("vision_scans")
    .select(scanColumns)
    .eq("baby_id", babyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as ScanRow[] ?? []).map(rowToScan);
}

export async function countScansToday(babyId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count, error } = await supabase
    .from("vision_scans")
    .select("id", { count: "exact", head: true })
    .eq("baby_id", babyId)
    .gte("created_at", startOfDay.toISOString());

  if (error) throw error;
  return count ?? 0;
}

export async function toggleScanSaved(scanId: string, isSaved: boolean): Promise<void> {
  const { error } = await supabase.from("vision_scans").update({ is_saved: isSaved }).eq("id", scanId);
  if (error) throw error;
}

export async function deleteScan(scanId: string): Promise<void> {
  const { error } = await supabase.from("vision_scans").delete().eq("id", scanId);
  if (error) throw error;
}

"use client";

import { useSubscription } from "@/components/billing/subscription-provider";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { prepareImageForUpload } from "@/lib/vision/image-prep";
import { getMyFamily } from "@/lib/supabase/family-repository";
import { getFamilyBabies } from "@/lib/supabase/babies-repository";
import { countScansToday, deleteScan, listScans, toggleScanSaved } from "@/lib/supabase/vision-repository";
import { activeVisionCategories, FREE_DAILY_VISION_SCANS, placeholderVisionCategories, visionCategoryLabels } from "@/types/vision";
import type { VisionCategory, VisionScan } from "@/types/vision";
import { Camera, Images, Heart, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ViewTab = "history" | "saved";

export function VisionDashboard() {
  const { userId } = useSupabaseUser();
  const { hasFeature } = useSubscription();
  const unlimited = hasFeature("ai_vision");
  const [babyId, setBabyId] = useState<string | null>(null);
  const [category, setCategory] = useState<VisionCategory>("food");
  const [scans, setScans] = useState<VisionScan[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [result, setResult] = useState<VisionScan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<ViewTab>("history");
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getMyFamily(userId)
      .then((result) => (result ? getFamilyBabies(result.family.id) : null))
      .then((babies) => {
        if (cancelled || !babies?.length) return;
        setBabyId(babies[0].id);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!babyId) return;
    let cancelled = false;
    Promise.all([listScans(babyId), countScansToday(babyId)])
      .then(([scanList, count]) => {
        if (cancelled) return;
        setScans(scanList);
        setTodayCount(count);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [babyId]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    try {
      const { base64, mimeType } = await prepareImageForUpload(file);
      const response = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, imageBase64: base64, mimeType }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? "Pilu Vision couldn't analyze this photo right now. Please try again.");
        return;
      }
      const scan: VisionScan = data;
      setResult(scan);
      setScans((current) => [scan, ...current]);
      setTodayCount((current) => current + 1);
    } catch {
      setError("Pilu Vision couldn't analyze this photo right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function toggleSave(scan: VisionScan) {
    const nextSaved = !scan.isSaved;
    setScans((current) => current.map((item) => (item.id === scan.id ? { ...item, isSaved: nextSaved } : item)));
    if (result?.id === scan.id) setResult({ ...result, isSaved: nextSaved });
    try {
      await toggleScanSaved(scan.id, nextSaved);
    } catch {
      setScans((current) => current.map((item) => (item.id === scan.id ? { ...item, isSaved: scan.isSaved } : item)));
    }
  }

  async function removeScan(scan: VisionScan) {
    setScans((current) => current.filter((item) => item.id !== scan.id));
    if (result?.id === scan.id) setResult(null);
    try {
      await deleteScan(scan.id);
    } catch {
      setScans((current) => [scan, ...current]);
    }
  }

  const remaining = Math.max(0, FREE_DAILY_VISION_SCANS - todayCount);
  const visible = tab === "saved" ? scans.filter((scan) => scan.isSaved) : scans;

  return (
    <div className="vision-page">
      <header className="vision-header">
        <p>Pilu Vision</p>
        <h1>Scan it, understand it</h1>
        <span>Food, bottles, labels, ingredients, toys, and baby products — Pilu Vision reads the photo and explains what it sees.</span>
      </header>

      <section className="vision-category-picker" aria-label="Scan category">
        {activeVisionCategories.map((item) => (
          <button key={item} type="button" className={category === item ? "vision-category-chip vision-category-chip--active" : "vision-category-chip"} onClick={() => setCategory(item)}>
            {visionCategoryLabels[item]}
          </button>
        ))}
        {placeholderVisionCategories.map((item) => (
          <span key={item} className="vision-category-chip vision-category-chip--soon" title="Coming soon">{visionCategoryLabels[item]} · Soon</span>
        ))}
      </section>

      <section className="vision-capture-card">
        <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ""; }} />
        <input ref={galleryInput} type="file" accept="image/*" hidden onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ""; }} />
        <div className="vision-capture-card__actions">
          <button type="button" className="button button--primary" disabled={isAnalyzing} onClick={() => cameraInput.current?.click()}><Camera size={18} aria-hidden="true" />{isAnalyzing ? "Analyzing…" : "Take photo"}</button>
          <button type="button" className="button button--secondary" disabled={isAnalyzing} onClick={() => galleryInput.current?.click()}><Images size={18} aria-hidden="true" />Choose from gallery</button>
        </div>
        <p className="vision-capture-card__quota">{unlimited ? "Unlimited scans with your plan." : `${remaining} of ${FREE_DAILY_VISION_SCANS} free scans left today.`}{!unlimited ? <Link href="/subscription"> Upgrade for unlimited</Link> : null}</p>
      </section>

      {error ? <p className="vision-error">{error}</p> : null}
      {result ? <VisionResultCard scan={result} onToggleSave={() => toggleSave(result)} /> : null}

      <section className="vision-history">
        <div className="vision-history__tabs" role="group" aria-label="Scan lists">
          <button type="button" className={tab === "history" ? "vision-history__tab vision-history__tab--active" : "vision-history__tab"} onClick={() => setTab("history")}>History</button>
          <button type="button" className={tab === "saved" ? "vision-history__tab vision-history__tab--active" : "vision-history__tab"} onClick={() => setTab("saved")}>Saved scans</button>
        </div>
        {visible.length === 0 ? (
          <p className="vision-history__empty">{tab === "saved" ? "Nothing saved yet — tap the heart on a scan to keep it here." : "Your scans will appear here."}</p>
        ) : (
          <div className="vision-scan-list">
            {visible.map((scan) => <VisionScanListItem key={scan.id} scan={scan} onToggleSave={() => toggleSave(scan)} onDelete={() => removeScan(scan)} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function VisionResultCard({ scan, onToggleSave }: { scan: VisionScan; onToggleSave: () => void }) {
  return (
    <section className="vision-result-card">
      <div className="vision-result-card__heading">
        <span className="vision-category-badge">{visionCategoryLabels[scan.category]}</span>
        <button type="button" className={scan.isSaved ? "vision-save-button vision-save-button--active" : "vision-save-button"} onClick={onToggleSave} aria-label={scan.isSaved ? "Remove from saved scans" : "Save this scan"}>
          <Heart size={18} aria-hidden="true" />
        </button>
      </div>
      <h2>{scan.title}</h2>
      <p>{scan.summary}</p>
      {scan.keyPoints.length ? <ul className="vision-result-card__points">{scan.keyPoints.map((point) => <li key={point}><Sparkles size={14} aria-hidden="true" />{point}</li>)}</ul> : null}
      {scan.concerns.length ? (
        <div className="vision-result-card__concerns">
          <p><TriangleAlert size={15} aria-hidden="true" />Worth double-checking</p>
          <ul>{scan.concerns.map((concern) => <li key={concern}>{concern}</li>)}</ul>
        </div>
      ) : null}
      <p className="vision-result-card__recommendation">{scan.recommendation}</p>
      <small>{scan.disclaimer}</small>
    </section>
  );
}

function VisionScanListItem({ scan, onToggleSave, onDelete }: { scan: VisionScan; onToggleSave: () => void; onDelete: () => void }) {
  return (
    <article className="vision-scan-item">
      <div>
        <span className="vision-category-badge">{visionCategoryLabels[scan.category]}</span>
        <h3>{scan.title}</h3>
        <p>{scan.summary}</p>
        <small>{new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(scan.createdAt))}</small>
      </div>
      <div className="vision-scan-item__actions">
        <button type="button" className={scan.isSaved ? "vision-save-button vision-save-button--active" : "vision-save-button"} onClick={onToggleSave} aria-label={scan.isSaved ? "Remove from saved scans" : "Save this scan"}><Heart size={16} aria-hidden="true" /></button>
        <button type="button" className="icon-button icon-button--soft" onClick={onDelete} aria-label="Delete this scan"><Trash2 size={16} aria-hidden="true" /></button>
      </div>
    </article>
  );
}

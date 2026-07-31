"use client";

import { denyConsent, grantConsent } from "@/lib/analytics/posthog-client";
import { buildAccountExport, downloadAccountExport } from "@/lib/account/export-data";
import { supabase } from "@/lib/supabase/client";
import { getAnalyticsConsent, updateAnalyticsConsent } from "@/lib/supabase/profile-repository";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function SettingsPage() {
  const { userId, isLoading: isUserLoading } = useSupabaseUser();
  const router = useRouter();

  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    getAnalyticsConsent(userId)
      .then((consent) => setAnalyticsConsent(consent === true))
      .catch(() => undefined)
      .finally(() => setIsConsentLoading(false));
  }, [userId]);

  async function toggleConsent(next: boolean) {
    if (!userId) return;
    setAnalyticsConsent(next);
    if (next) grantConsent();
    else denyConsent();
    await updateAnalyticsConsent(userId, next).catch(() => undefined);
  }

  async function exportData() {
    if (!userId) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const data = await buildAccountExport(userId);
      downloadAccountExport(data);
    } catch {
      setExportError("Couldn't prepare your export right now. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function deleteAccount() {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch("/api/account/delete", { method: "POST" });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setDeleteError(body.error || "Something went wrong. Please try again.");
        setIsDeleting(false);
        return;
      }
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setDeleteError("Something went wrong. Please try again.");
      setIsDeleting(false);
    }
  }

  if (isUserLoading) return <SkeletonScreen />;

  return (
    <div className="app-page-stack">
      <PageHeader eyebrow="Pilu" title="Settings" description="Manage your account, privacy, and data." />

      <section className="settings-section">
        <h2>Analytics</h2>
        <p>Help us understand how Pilu is used. We never send your baby&apos;s name, notes, or AI conversations.</p>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={analyticsConsent}
            disabled={isConsentLoading}
            onChange={(event) => toggleConsent(event.target.checked)}
          />
          Share anonymous usage analytics
        </label>
      </section>

      <section className="settings-section">
        <h2>Export your data</h2>
        <p>Download your profile, family membership, baby profiles, and every log tied to your account as a single JSON file.</p>
        <button type="button" className="button button--secondary" disabled={isExporting} onClick={exportData}>
          {isExporting ? "Preparing…" : "Export my data"}
        </button>
        {exportError ? <p className="activity-form__error">{exportError}</p> : null}
      </section>

      <section className="settings-section">
        <h2>Legal</h2>
        <Link href="/privacy-policy" className="article-reader__back">Privacy Policy</Link>
      </section>

      <section className="settings-section settings-section--danger">
        <h2>Delete account</h2>
        <p>Permanently delete your Pilu account and every log, memory, and journal entry tied to it. This can&apos;t be undone.</p>
        <button type="button" className="button button--danger" onClick={() => setIsDeleteDialogOpen(true)}>
          Delete my account
        </button>
      </section>

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={() => { setIsDeleteDialogOpen(false); setDeleteError(null); }}
        onConfirm={deleteAccount}
      />
    </div>
  );
}

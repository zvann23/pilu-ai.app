"use client";

import { denyConsent, grantConsent } from "@/lib/analytics/posthog-client";
import { buildAccountExport, downloadAccountExport } from "@/lib/account/export-data";
import { supabase } from "@/lib/supabase/client";
import { getAnalyticsConsent, updateAnalyticsConsent } from "@/lib/supabase/profile-repository";
import { useSupabaseUser } from "@/hooks/use-supabase-user";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonScreen } from "@/components/ui/skeleton-screen";
import { useLocale } from "@/components/i18n/locale-provider";
import { locales, localeLabels } from "@/lib/i18n/locales";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeleteAccountDialog } from "./delete-account-dialog";

export function SettingsPage() {
  const { userId, isLoading: isUserLoading } = useSupabaseUser();
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

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
      setExportError(t((d) => d.settings.export.error));
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
        setDeleteError(body.error || t((d) => d.settings.deleteDialog.genericError));
        setIsDeleting(false);
        return;
      }
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setDeleteError(t((d) => d.settings.deleteDialog.genericError));
      setIsDeleting(false);
    }
  }

  if (isUserLoading) return <SkeletonScreen />;

  return (
    <div className="app-page-stack">
      <PageHeader
        eyebrow={t((d) => d.settings.eyebrow)}
        title={t((d) => d.settings.title)}
        description={t((d) => d.settings.description)}
      />

      <section className="settings-section">
        <h2>{t((d) => d.settings.language.heading)}</h2>
        <p>{t((d) => d.settings.language.description)}</p>
        <div className="settings-language-options" role="radiogroup" aria-label={t((d) => d.settings.language.heading)}>
          {locales.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={locale === option}
              className={`settings-language-option${locale === option ? " settings-language-option--active" : ""}`}
              onClick={() => setLocale(option)}
            >
              {localeLabels[option]}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2>{t((d) => d.settings.analytics.heading)}</h2>
        <p>{t((d) => d.settings.analytics.description)}</p>
        <label className="settings-toggle">
          <input
            type="checkbox"
            checked={analyticsConsent}
            disabled={isConsentLoading}
            onChange={(event) => toggleConsent(event.target.checked)}
          />
          {t((d) => d.settings.analytics.toggleLabel)}
        </label>
      </section>

      <section className="settings-section">
        <h2>{t((d) => d.settings.export.heading)}</h2>
        <p>{t((d) => d.settings.export.description)}</p>
        <button type="button" className="button button--secondary" disabled={isExporting} onClick={exportData}>
          {isExporting ? t((d) => d.settings.export.buttonLoading) : t((d) => d.settings.export.button)}
        </button>
        {exportError ? <p className="activity-form__error">{exportError}</p> : null}
      </section>

      <section className="settings-section">
        <h2>{t((d) => d.settings.legal.heading)}</h2>
        <Link href="/privacy-policy" className="article-reader__back">{t((d) => d.settings.legal.privacyPolicy)}</Link>
      </section>

      <section className="settings-section settings-section--danger">
        <h2>{t((d) => d.settings.danger.heading)}</h2>
        <p>{t((d) => d.settings.danger.description)}</p>
        <button type="button" className="button button--danger" onClick={() => setIsDeleteDialogOpen(true)}>
          {t((d) => d.settings.danger.button)}
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

"use client";

import { FirstAidOpenedTracker } from "@/components/analytics/first-aid-opened-tracker";
import { useLocale } from "@/components/i18n/locale-provider";
import { ComingSoonCard } from "@/components/ui/coming-soon-card";
import { PageHeader } from "@/components/ui/page-header";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function NavComingSoon({ navId, slug }: { navId: keyof Dictionary["nav"]["items"]; slug: string }) {
  const { t } = useLocale();
  const { label, description } = t((d) => d.nav.items[navId]);
  const comingSoon = t((d) => d.common.comingSoon);

  return (
    <div className="app-page-stack">
      {slug === "first-aid" ? <FirstAidOpenedTracker /> : null}
      <PageHeader eyebrow="Pilu" title={label} description={description} />
      <ComingSoonCard
        title={`${label} ${comingSoon.titleSuffix}`}
        description={comingSoon.description}
        illustration={slug === "diapers" ? "bath-duck" : "teddy"}
      />
    </div>
  );
}

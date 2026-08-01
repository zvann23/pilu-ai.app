"use client";

import { FeatureGate } from "@/components/billing/feature-gate";
import { useLocale } from "@/components/i18n/locale-provider";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { FeatureKey } from "@/types/billing";
import type { ReactNode } from "react";

export function GatedNavFeature({
  feature, navId, children,
}: {
  feature: FeatureKey;
  navId: keyof Dictionary["nav"]["gates"];
  children: ReactNode;
}) {
  const { t } = useLocale();
  const title = t((d) => d.nav.gates[navId].title);
  const description = t((d) => d.nav.gates[navId].description);

  return <FeatureGate feature={feature} title={title} description={description}>{children}</FeatureGate>;
}

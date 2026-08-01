"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import type { FamilyRole } from "@/types/family";

export function RoleBadge({ role }: { role: FamilyRole }) {
  const { t } = useLocale();
  return <span className={`role-badge role-badge--${role}`}>{t((d) => d.family.roles.labels[role])}</span>;
}

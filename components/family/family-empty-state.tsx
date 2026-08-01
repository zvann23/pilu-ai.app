"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Users } from "lucide-react";
import Link from "next/link";

export function FamilyEmptyState() {
  const { t } = useLocale();
  const fd = t((d) => d.family.emptyState);
  return (
    <div className="family-empty-state">
      <Users size={24} aria-hidden="true" />
      <p>{fd.noFamily}</p>
      <Link href="/family">{fd.createOrJoinLink}</Link>
    </div>
  );
}

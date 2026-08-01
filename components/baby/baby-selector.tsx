"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { ChevronDown, Plus } from "lucide-react";

export function BabySelector({ name }: { name: string }) {
  const { t } = useLocale();
  const dict = t((d) => d.baby.selector);
  return <div className="baby-selector"><button type="button" aria-label={dict.selectLabel}><span>{name}</span><ChevronDown size={16} aria-hidden="true" /></button><span><Plus size={14} aria-hidden="true" />{dict.addAnother} <em>{dict.comingLater}</em></span></div>;
}

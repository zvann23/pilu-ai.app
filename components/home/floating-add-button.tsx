"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Plus } from "lucide-react";

export function FloatingAddButton({ onClick }: { onClick: () => void }) {
  const { t } = useLocale();
  return <button className="floating-add-button" type="button" onClick={onClick} aria-label={t((d) => d.home.floatingAddButtonLabel)}><Plus size={27} strokeWidth={2.4} aria-hidden="true" /></button>;
}

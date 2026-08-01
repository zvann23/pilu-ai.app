"use client";

import { useLocale } from "@/components/i18n/locale-provider";

export function ChatDisclaimer() {
  const { t } = useLocale();
  return <p className="chat-disclaimer">{t((d) => d.chat.disclaimer)}</p>;
}

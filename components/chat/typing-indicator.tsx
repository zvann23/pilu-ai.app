"use client";

import { useLocale } from "@/components/i18n/locale-provider";

export function TypingIndicator() {
  const { t } = useLocale();
  return <div className="typing-indicator" role="status" aria-label={t((d) => d.chat.typingLabel)}><i /><i /><i /></div>;
}

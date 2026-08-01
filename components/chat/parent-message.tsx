"use client";

import { useLocale } from "@/components/i18n/locale-provider";

export function ParentMessage({ text }: { text: string }) {
  const { t } = useLocale();
  return <article className="chat-message chat-message--parent"><span>{t((d) => d.chat.message.you)}</span><p>{text}</p></article>;
}

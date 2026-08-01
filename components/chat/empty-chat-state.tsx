"use client";

import { Sparkles } from "lucide-react";
import { PiluIllustration } from "@/components/illustrations/pilu-illustration";
import { format, useLocale } from "@/components/i18n/locale-provider";

export function EmptyChatState({ name }: { name: string }) {
  const { t } = useLocale();
  const dict = t((d) => d.chat.emptyState);
  return <div className="empty-chat-state"><PiluIllustration variant="teddy" className="empty-chat-state__illustration" /><div><Sparkles size={23} aria-hidden="true" /></div><h2>{dict.heading}</h2><p>{format(dict.body, { name })}</p></div>;
}

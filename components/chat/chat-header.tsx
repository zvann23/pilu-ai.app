"use client";

import { PiluLogo } from "@/components/branding/logo";
import { useLocale } from "@/components/i18n/locale-provider";
import { RotateCcw } from "lucide-react";

export function ChatHeader({ onNewConversation, disabled }: { onNewConversation: () => void; disabled: boolean }) {
  const { t } = useLocale();
  const dict = t((d) => d.chat.header);
  return <header className="chat-header"><div className="chat-header__mark"><PiluLogo size="small" /><div><h1>{dict.title}</h1><span>{dict.subtitle}</span></div></div><button type="button" className="icon-button icon-button--soft" aria-label={dict.newConversation} onClick={onNewConversation} disabled={disabled}><RotateCcw size={18} aria-hidden="true" /></button></header>;
}

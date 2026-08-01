"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { Send } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";

const LIMIT = 1200;
export function ChatComposer({ value, sending, onChange, onSend }: { value: string; sending: boolean; onChange: (value: string) => void; onSend: () => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.chat.composer);
  const input = useRef<HTMLTextAreaElement>(null);
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); } };
  return <div className="chat-composer"><label className="sr-only" htmlFor="ask-pilu-message">{dict.label}</label><textarea ref={input} id="ask-pilu-message" rows={1} value={value} maxLength={LIMIT} placeholder={dict.placeholder} disabled={sending} onChange={(event) => onChange(event.target.value)} onKeyDown={keyDown} /><div><span>{value.length}/{LIMIT}</span><button type="button" className="chat-composer__send" aria-label={dict.sendLabel} disabled={sending || !value.trim()} onClick={onSend}><Send size={18} aria-hidden="true" /></button></div></div>;
}

"use client";

import { Send } from "lucide-react";
import { useRef, type KeyboardEvent } from "react";

const LIMIT = 1200;
export function ChatComposer({ value, sending, onChange, onSend }: { value: string; sending: boolean; onChange: (value: string) => void; onSend: () => void }) { const input = useRef<HTMLTextAreaElement>(null); const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSend(); } }; return <div className="chat-composer"><label className="sr-only" htmlFor="ask-pilu-message">Ask Pilu a question</label><textarea ref={input} id="ask-pilu-message" rows={1} value={value} maxLength={LIMIT} placeholder="Ask anything about your little one…" disabled={sending} onChange={(event) => onChange(event.target.value)} onKeyDown={keyDown} /><div><span>{value.length}/{LIMIT}</span><button type="button" className="chat-composer__send" aria-label="Send message" disabled={sending || !value.trim()} onClick={onSend}><Send size={18} aria-hidden="true" /></button></div></div>; }

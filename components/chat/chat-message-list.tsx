import type { ChatMessage, ChatUrgency } from "@/types/chat";
import { useEffect, useRef } from "react";
import { ParentMessage } from "./parent-message";
import { PiluMessage } from "./pilu-message";
import { TypingIndicator } from "./typing-indicator";
import { UrgencyCard } from "./urgency-card";

export function ChatMessageList({ messages, sending }: { messages: ChatMessage[]; sending: boolean }) { const end = useRef<HTMLDivElement>(null); useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, sending]); return <section className="chat-message-list" aria-live="polite" aria-label="Conversation">{messages.map((message) => message.role === "parent" ? <ParentMessage key={message.id} text={message.text} /> : message.role === "safety" ? <UrgencyCard key={message.id} urgency={message.text as ChatUrgency} /> : message.response ? <PiluMessage key={message.id} response={message.response} /> : null)}{sending ? <TypingIndicator /> : null}<div ref={end} /></section>; }
